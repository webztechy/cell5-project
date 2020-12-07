import { NextFunction, Request, Response, Router } from 'express';
import async from 'async';
import sha1 from 'sha1';

import UsersController from '../../controllers/UsersController';
import ConnectionModel from '../../models/ConnectionModel';

import UtilitiesHelper from '../../helpers/UtilitiesHelper';
import dotenv from 'dotenv';

class UsersRouter {

  private _router = Router();
  private _async = async;
  private _sha1 = sha1;
  private _controller = UsersController;
  private _connection = ConnectionModel;
  
  get router() {
    return this._router;
  }

  constructor() {
    dotenv.config();
    this._configure();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  private _configure() {

    const DBconnect = this._connection;
    const SHA1 = this._sha1;
    const TBLprefix = process.env.TBL_PREFIX;
    const error_response : any = JSON.stringify({status : 0 , message : 'Could not process request!'});


    interface keyMainFields{
      username : string;
      password : string;
      first_name : string;
      last_name : string;
      type : number;
      status: number;
      date_created : string;
    }
  
    interface keyMetaFields{
      address : string;
      contact_number : string;
      email : string;
    }


    // roots --------------------------------------------------------------------------------------
    this._router.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.status(200).json(this._controller.defaultMethod());
    });
    

    // total --------------------------------------------------------------------------------------
    this._router.post('/total', (req: Request, res: Response, next: NextFunction) => {
      try{
        const query : string = ` SELECT COUNT(*) as total FROM ${TBLprefix}users `;
        DBconnect.query( query, function( err : Array<any>,  rows : Array<any>, fields : Array<any> ) {
            if (err){
                res.status(400).send( error_response );
            }else{
              res.send(JSON.stringify( { status : 1, total : rows[0]['total'] }));
            }
        });

      }catch( err: any ){
        res.status(400).send( error_response );
      } 
    });
    
    // add --------------------------------------------------------------------------------------
    this._router.post('/add', (req: Request, res: Response, next: NextFunction) => {

      try{
          const meta_data : any = req.body;
          
          let data_main : keyMainFields, data_meta : keyMetaFields;
          data_main = {
                        username : meta_data.username,
                        password : '',
                        first_name : meta_data.first_name,
                        last_name : meta_data.last_name,
                        type : meta_data.type,
                        status : meta_data.status,
                        date_created : ''
                    }

            if (meta_data.hasOwnProperty('password')) {
              const password_request : string = meta_data.password;
              const password_request_encoded : string  = SHA1(password_request);
    
              data_main = { ...data_main, ...{ password : password_request_encoded } };
            }
      
            if (meta_data.hasOwnProperty('date_created')) {
              data_main = { ...data_main, ...{ date_created : meta_data.date_created } };
            }
          
          data_meta = {
            address : meta_data.address,
            contact_number : meta_data.contact_number,
            email : meta_data.email
          };
          
          this._async.waterfall([
            
            function(callback : any ) {

              let data_fields : any  = [];
              let data_values : any  = [];

              for (const [key, value] of Object.entries(data_main)) {
                data_values.push( `"${value}"` );
                data_fields.push( key );
              }

              try{
                let query : string = ` INSERT INTO ${TBLprefix}users (${data_fields.join(',')}) VALUES (${data_values.join(',')}); `;

                DBconnect.query( query, function( err : Array<any>,  rows : any , fields : Array<any> ) {
                    if (err){
                      callback(null, 0);
                    }else{
                      callback(null, rows.insertId );
                    }
                });  
                
              }catch( err ){
                  callback(null, 0);
              }  
            }
            
          ], function(err : any, new_id : any ) {

             if (parseInt(new_id)>0 ){

                let query : string = '';
                for (const [key, value] of Object.entries(data_meta) ) {
                  query += ` INSERT INTO ${TBLprefix}users_meta (group_id, meta_key, meta_value) VALUES ('${new_id}', '${key}', '${value}'); `;
                } 

                try{
                  DBconnect.query( query, function( err : Array<any>,  rows : Array<any>, fields : Array<any> ) {
                    if (err){
                      res.status(400).send(error_response);
                    }else{
                      res.send(JSON.stringify( { status : 1, id : new_id }));
                    }
                  }); 

                }catch( err  : any ){
                  res.status(400).send( error_response );
                } 

             }else{
                res.status(400).send( error_response );
             }

          });  

      }catch( err : any  ){
        res.status(400).send( error_response );
      } 


    });


    // update --------------------------------------------------------------------------------------
    this._router.post('/update',function(req, res){

      try{  

        const meta_data : any = req.body;
        const id : number = parseInt(meta_data.id);
      
        let data_main : keyMainFields, data_meta : keyMetaFields;
        data_main = {
                      username : meta_data.username,
                      password : '',
                      first_name : meta_data.first_name,
                      last_name : meta_data.last_name,
                      type : meta_data.type,
                      status : meta_data.status,
                      date_created : ''
                  }
         
        if (meta_data.hasOwnProperty('password')) {
          const password_request : string = meta_data.password;
          const password_request_encoded : string  = SHA1(password_request);

          data_main = { ...data_main, ...{ password : password_request_encoded } };
        }
        
        data_meta = {
          address : meta_data.address,
          contact_number : meta_data.contact_number,
          email : meta_data.email
        };

        async.parallel({

          main: function(callback : any ) {

              let data_meta : any = [];
              for (const [key, value] of Object.entries(data_main)) {
                
                if (key==='date_created'){ continue; }
                if ( !meta_data.hasOwnProperty('password')) { continue; }

                data_meta.push( key+'="'+value+'"' );
              }
        
              const data_main_imploded = data_meta.join(', ');

              try{
                let query : string = ` UPDATE ${TBLprefix}users SET ${data_main_imploded}  WHERE id IN (${id}) `;
                DBconnect.query( query, function( err : Array<any>,  rows : Array<any>, fields : Array<any> ) {
                    if (err){
                      callback(null, 0);
                    }else{
                      callback(null, 1);
                    }
                }); 
              }catch( err  : any ){
                callback(null, 0);
              } 
          }

        }, function(err : any, results : any ) {

            if (parseInt(results.main)>0 ){

              let query = '';
              for (const [key, value] of Object.entries(data_meta) ) {
                query += ` UPDATE ${TBLprefix}users_meta SET meta_value = '${value}' WHERE meta_key LIKE '${key}' AND  group_id IN (${id}); `;
              } 

              try{
                DBconnect.query( query, function( err : Array<any>,  rows : Array<any>, fields : Array<any> ) {
                  if (err){
                    res.status(400).send(error_response);
                  }else{
                    res.send(JSON.stringify( { status : 1, id : id }));
                  }
                }); 

              }catch( err  : any ){
                res.status(400).send( error_response );
              } 

            }else{
              res.status(400).send( error_response );
            }

        });
      
      }catch( err  : any ){
        res.status(400).send( error_response );
      } 

    });
    

    // delete --------------------------------------------------------------------------------------
    this._router.post('/delete',function(req, res){

      try{  

        const meta_data : any = req.body;
        const ids : string = meta_data.ids;

        async.parallel({
          main: function(callback : any) {
            
            try{
              let query : string =  `DELETE  FROM ${TBLprefix}users WHERE id IN (${ids})`;
              DBconnect.query( query, function( err : Array<any>,  rows : Array<any>, fields : Array<any> ) {
                    if (err){
                      callback(null, 0);
                    }else{
                      callback(null, 1);
                    }
                }); 
              }catch( err  : any ){
                callback(null, 0);
              } 
          }
        }, function(err : any, results : any ) {
          
          if (parseInt(results.main)>0 ){

            try{
              
              let query : string = ` DELETE  FROM ${TBLprefix}users_meta WHERE group_id IN (${ids}) `;
              DBconnect.query( query, function( err : Array<any>,  rows : Array<any>, fields : Array<any> ) {
                if (err){
                  res.status(400).send(error_response);
                }else{
                  res.send(JSON.stringify( { status : 1, id : ids }));
                }
              }); 

            }catch( err  : any ){
              res.status(400).send( error_response );
            } 

          }else{
            res.status(400).send( error_response );
          }

        });


      }catch( err : any  ){
           res.status(400).send( error_response );
      }

    });



     // list --------------------------------------------------------------------------------------
    /*
    *  URL: http://localhost:3000/api/users/list?page=1&limit=5
    *
    */

   this._router.post("/list", async ( req: Request, res: Response, next: NextFunction ) => {
        
      try{

        const params_request : any = req.query;
          let sql_limit_arr : Array<number> = [];
          let status : number = 0, query : string = '' ;
          let limit : number = 15, current_page : number = 1;

          if ( params_request.hasOwnProperty('limit')) {
            limit = parseInt(params_request['limit']);
          }

        if (params_request.hasOwnProperty('page')) {
            let page : any = ( parseInt(params_request['page'])===1) ? 0 :  parseInt(params_request['page']);

            current_page = page + 1;

            if (page>1){ page = (page-1) * limit ; }
            sql_limit_arr.push( parseInt(page) );
          }
      
          if (params_request.hasOwnProperty('limit')) {
            sql_limit_arr.push(limit);
          } 


          this._async.parallel({

            list: function(callback : any) {

                  let query : string = ` SELECT * FROM  ${TBLprefix}users ORDER BY first_name ASC, last_name ASC  `;
        
                  if (params_request.hasOwnProperty('id')) {
                    query = ` SELECT * FROM  ${TBLprefix}users WHERE id IN ( ${params_request['id']} )`;
                  }
          
                  if ( sql_limit_arr.length>1 ){
                    query += " LIMIT " + sql_limit_arr.join(',');
                  }
      
                  try{
      
                    DBconnect.query( query, function( err : Array<any>,  rows : Array<any>, fields : Array<any> ) {
                        if (err){
                          callback(null, { status : 0 } );
                        }else{
                          callback(null, { status : 1 , rows : rows} );
                        }
                    });
      
                  }catch( err: any ){
                    callback(null, { status :0 } );
                  } 

            }, 

            total: function(callback : any) {
                  try{
                    const query : string = ` SELECT COUNT(*) as total FROM ${TBLprefix}users  `;
                    DBconnect.query( query, function( err : Array<any>,  rows : Array<any>, fields : Array<any> ) {
                        if (err){
                          callback(null, { status : 0 } );
                        }else{
                          callback(null, { status : 1 , total : rows[0]['total'] } );
                        }
                    });

                  }catch( err: any ){
                    callback(null, { status : 0 } );
                  } 
            }

          }, function(err : any, results : any ) {


            try{
              
              let total_list : any = {}, users_list : any = {} ;

              total_list = results.total;
              users_list = results.list;

              if ( parseInt(total_list.total)>0 && parseInt(total_list.status)===1 && parseInt(users_list.status)===1 ){

                let all_users_id_arr : any = [];
                let all_users_rows : any = [];

                for (const [key, value ]  of Object.entries(users_list.rows) ) {
                  let row : any = [];
                  row = value;
                  all_users_id_arr.push(row.id);
                  all_users_rows[row.id] = value;
                }
          
                let all_users_id_imploded : string = all_users_id_arr.join();
        
                let query = ` SELECT * FROM  ${TBLprefix}users_meta WHERE group_id IN (${all_users_id_imploded}) `;
                DBconnect.query( query, function( err : Array<any>,  rows : Array<any>, fields : Array<any> ) {
                    if (err){
                      res.status(500).send(error_response);
                    }else{
                      
                      let row_meta : any = [];
                      row_meta = UtilitiesHelper._convertArray(rows);
                      for (const [key, value] of Object.entries(row_meta)) {
                          let row : any = [];
                          row = value;
                          const product_id : number = row.group_id;
            
                          if (all_users_rows.hasOwnProperty(product_id)) {
                            let add_value = all_users_rows[product_id];
                            row_meta[key] = {...row_meta[key], ...add_value };
                          }
                      } 
                      

                      res.send(JSON.stringify({
                                        status : 1,
                                        total_records : total_list.total, 
                                        total_pages : Math.ceil(total_list.total/limit),
                                        per_page : limit,
                                        current_page : current_page,
                                        list: row_meta
                                    })); 
                    }
                });

              }else{

                  res.send(JSON.stringify({
                      status : 1,
                      total_records : total_list.total, 
                      total_pages : 0,
                      per_page : limit,
                      current_page : current_page,
                      list: []
                  })); 
              }


            }catch( err ){
              res.status(400).send( error_response );
            } 

          });


      }catch( err: any ){
        res.status(400).send( error_response );
      } 


    });


    // END --------------------------------------------------------------------------------------
  }
}

export = new UsersRouter().router;