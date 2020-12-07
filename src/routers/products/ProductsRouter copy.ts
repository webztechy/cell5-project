import { NextFunction, Request, Response, Router } from 'express';
import async from 'async';

import ProductsController from '../../controllers/ProductsController';
import ConnectionModel from '../../models/ConnectionModel';

import UtilitiesHelper from '../../helpers/UtilitiesHelper';
import dotenv from 'dotenv';

interface ProductMainFields {
  id: number;
  name: string;
  category_id: number;
  featured_status: number;
  status: number;
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

    // roots --------------------------------------------------------------------------------------
    this._router.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.status(200).json(this._controller.defaultMethod());
    });


    // add --------------------------------------------------------------------------------------
    this._router.get('/add', (req: Request, res: Response, next: NextFunction) => {

      interface returnValues {
        num: number;
      }

      let return_values : returnValues;
      return_values = { num : 5 };

      let message : string;
      message =  'this is add!';
      
      res.status(200).json({ message : message });
    });


    // list --------------------------------------------------------------------------------------
    this._router.post("/list", async ( req: Request, res: Response, next: NextFunction ) => {
        
      try{

        const params_request : any = req.query;
        let sql_limit_arr : Array<number> = [];
        
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
          product_list: function(callback : any) {

            let query : string = ` SELECT * FROM  ${TBLprefix}products WHERE status = 1 ORDER BY name ASC `;
    
            if (params_request.hasOwnProperty('id')) {
              query = ` SELECT * FROM  ${TBLprefix}products WHERE id IN ( ${params_request['id']} )`;
            }
    
            if (params_request.hasOwnProperty('category_ids')) {
              query = ` SELECT * FROM  ${TBLprefix}products WHERE category_id IN (${params_request['category_ids']}) `;
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
          total_list: function(callback : any) {

              try{
                const query : string = ` SELECT COUNT(*) as total FROM ${TBLprefix}products WHERE status = 1 `;
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
        
                let query = ` SELECT * FROM  ${TBLprefix}products_meta WHERE group_id IN (${all_products_id_imploded}) `;
                DBconnect.query( query, function( err : Array<any>,  rows : Array<any>, fields : Array<any> ) {
                    if (err){
                      res.status(500).send({ status : 0 , message : 'Could not process request!'} );
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
            res.status(400).send(JSON.stringify({ status : 0 , message : 'Could not process request!'}) );
          } 

        });

        
      }catch( err: any ){
        res.status(400).send(JSON.stringify({status : 0 , message : 'Could not process request!'}) );
      } 

    });

    // list --------------------------------------------------------------------------------------
    /* this._router.get('/list2', (req: Request, res: Response, next: NextFunction) => {

      try{
          let query : string;

          query = ` SELECT group_id FROM ${TBLprefix}categories WHERE meta_key IN ('status') AND meta_value IN (1) `;
          query = ` SELECT * FROM ${TBLprefix}categories WHERE group_id IN (${query}) `;
      
          this._connection.query( query, function( err : Array<any>,  rows : Array<any>, fields : Array<any> ) {
              if (err){
                res.status(500).send(err);
              }else{
                let row_meta = UtilitiesHelper._convertArray(rows);
                res.send(JSON.stringify(row_meta));
              }
          });
      
        }catch( err: any ){
          res.status(400).send(err);
        } 

    }); */


  }
}

export = new ProductsRouter().router;