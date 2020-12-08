import { NextFunction, Request, Response, Router } from 'express';
import async from 'async';

import ProductsController from '../../controllers/ProductsController';
import ConnectionModel from '../../models/ConnectionModel';

import UtilitiesHelper from '../../helpers/UtilitiesHelper';
import dotenv from 'dotenv';


interface keyMainFields{
  name: string;
  price: string;
  brand_id: string;
  featured_status: string;
  status: string;
  date_created : string;
}

interface keyMetaFields{
  gallery : string;
  image : string;
  description : string;
}

class ProductsRouter {

  private _router = Router();
  private _async = async;
  private _controller = ProductsController;
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
    const TBLprefix = process.env.TBL_PREFIX;
    const error_response : any = JSON.stringify({status : 0 , message : 'Could not process request!'});

    // roots --------------------------------------------------------------------------------------
    this._router.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.status(200).json(this._controller.defaultMethod());
    });

    
    // total --------------------------------------------------------------------------------------
    this._router.post('/total', (req: Request, res: Response, next: NextFunction) => {
      try{
        const query : string = ` SELECT COUNT(*) as total FROM ${TBLprefix}products `;
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
                        name : meta_data.name,
                        price : meta_data.price,
                        brand_id : meta_data.brand_id,
                        featured_status : meta_data.featured_status,
                        status : meta_data.status,
                        date_created : ''
                    }

            if (meta_data.hasOwnProperty('date_created')) {
              data_main = { ...data_main, ...{ date_created : meta_data.date_created } };
            }
          
          data_meta = {
            gallery : '', //meta_data.gallery,
            image : '', //meta_data.image,
            description : meta_data.description
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
                let query : string = ` INSERT INTO ${TBLprefix}products (${data_fields.join(',')}) VALUES (${data_values.join(',')}); `;

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
                  query += ` INSERT INTO ${TBLprefix}products_meta (group_id, meta_key, meta_value) VALUES ('${new_id}', '${key}', '${value}'); `;
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

        const params_request : any = req.query;
        const meta_data : any = req.body;
        const id : string = meta_data.id;

        let data_main : keyMainFields, data_meta : keyMetaFields;
        data_main = {
              name : meta_data.name,
              price : meta_data.price,
              brand_id : meta_data.brand_id,
              featured_status : meta_data.featured_status,
              status : meta_data.status,
              date_created : ''
          }
         
        data_meta = {
          gallery : '', //meta_data.gallery,
          image : '', //meta_data.image,
          description : meta_data.description
        };

        async.parallel({

          main: function(callback : any ) {

              let data_meta : any = [];
              for (const [key, value] of Object.entries(data_main)) {
                if (key==='date_created'){ continue; }

                if (params_request.hasOwnProperty('bulk')) {
                   if (key==='name'){ continue; }
                   //if (key==='price' && value==='' ){ continue; }
                }

                if ( typeof value==='undefined' ){ continue; }

                data_meta.push( key+'="'+value+'"' );
              }
        
              const data_main_imploded = data_meta.join(', ');

              try{
                let query : string = ` UPDATE ${TBLprefix}products SET ${data_main_imploded}  WHERE id IN (${id}) `;
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

                if (params_request.hasOwnProperty('bulk')) {
                  if (key==='description'){ continue; }
                }

                if ( typeof value==='undefined' ){ continue; }

                query += ` UPDATE ${TBLprefix}products_meta SET meta_value = '${value}' WHERE meta_key LIKE '${key}' AND  group_id IN (${id}); `;
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
              let query : string =  `DELETE  FROM ${TBLprefix}products WHERE id IN (${ids})`;
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
              
              let query : string = ` DELETE  FROM ${TBLprefix}products_meta WHERE group_id IN (${ids}) `;
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
    *  URL: http://localhost:3000/api/products/list?page=1&limit=5
    *
    */

    this._router.post("/list", async ( req: Request, res: Response, next: NextFunction ) => {
        
      try{

        const params_request : any = req.query;
        const params_body : any = req.body;

        let sql_limit_arr : Array<number> = [];

        let limit : number = 15, current_page : number = 1;

        if ( params_body.hasOwnProperty('limit')) {
          limit = parseInt(params_body['limit']);
        }

       if (params_body.hasOwnProperty('page')) {
          let page : any = ( parseInt(params_body['page'])===1) ? 0 :  parseInt(params_body['page']);

          current_page = page + 1;

          if (page>1){ page = (page-1) * limit ; }
          sql_limit_arr.push( parseInt(page) );
        }
    
        if (params_body.hasOwnProperty('limit')) {
          sql_limit_arr.push(limit);
        } 

        let where_conditions : string = '';
        let where_conditions_arr : any = [];
        let query_order : string = ` ORDER BY name ASC `;

        if ( params_body.hasOwnProperty('status')) {
          let status : number = parseInt(params_body['status']);
          if ( status>=0 ){ where_conditions_arr.push(` status IN (${status}) `); }
        }

        if ( params_body.hasOwnProperty('featured')) {
            let featured : number  = parseInt(params_body['featured']);
            if ( featured>=0 ){ where_conditions_arr.push(` featured_status IN (${featured}) `); }
        }

        if ( params_body.hasOwnProperty('brand_id')) {
          let brand_id : number  = parseInt(params_body['brand_id']);
          if ( brand_id>0 ){ where_conditions_arr.push(` brand_id IN (${brand_id}) `); }
       }

        if ( params_body.hasOwnProperty('name')) {
          let name : string  = params_body['name'];
          if ( name!=='' ){ where_conditions_arr.push(` name LIKE "${name}%" `); }
        }

        if ( where_conditions_arr.length>0 ){
          where_conditions = ` WHERE ${where_conditions_arr.join(' AND ')} `;
        }


        if ( params_body.hasOwnProperty('sorting')) {
          let sorting : string  = params_body['sorting'];
          if ( sorting!=='' ){ query_order = ` ORDER BY ${sorting} `; }
        }
        
        this._async.parallel({
          product_list: function(callback : any) {

            let query : string = ` SELECT * FROM  ${TBLprefix}products ${where_conditions} ${query_order} `;
    
            if (params_body.hasOwnProperty('id')) {
              query = ` SELECT * FROM  ${TBLprefix}products WHERE id IN ( ${params_body['id']} )`;
            }
    
            /* if (params_body.hasOwnProperty('brand_ids')) {
              query = ` SELECT * FROM  ${TBLprefix}products WHERE brand_id IN (${params_body['brand_ids']}) `;
            } */
    
            if ( sql_limit_arr.length>1 ){
              query += " LIMIT " + sql_limit_arr.join(',');
            }

            //console.log(query);

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

          total_list: function(callback : any) {

              try{
                const query : string = ` SELECT COUNT(*) as total FROM ${TBLprefix}products ${where_conditions} ${query_order} `;
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
              let total_list : any = {}, product_list : any = {} ;

              total_list = results.total_list;
              product_list = results.product_list;

              if ( parseInt(total_list.total)>0 && parseInt(total_list.status)===1 && parseInt(product_list.status)===1 ){

                let all_products_id_arr : any = [];
                let all_products_rows : any = [];

                for (const [key, value ]  of Object.entries(product_list.rows) ) {
                  let row : any = [];
                  row = value;
                  all_products_id_arr.push(row.id);
                  all_products_rows[row.id] = value;
                }
          
                let all_products_id_imploded : string = all_products_id_arr.join();
        
                let query = ` SELECT * FROM  ${TBLprefix}products_meta WHERE group_id IN (${all_products_id_imploded}) ORDER BY FIELD( group_id, ${all_products_id_imploded} )  `;
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
            
                          if (all_products_rows.hasOwnProperty(product_id)) {
                            let add_value = all_products_rows[product_id];
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
              

          }catch( err: any ){
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

export = new ProductsRouter().router;