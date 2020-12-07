import { NextFunction, Request, Response, Router } from 'express';
//import async from 'async';
import sha1 from 'sha1';

import UsersController from '../../controllers/UsersController';
import ConnectionModel from '../../models/ConnectionModel';

import dotenv from 'dotenv';

class LoginRouter {

  private _router = Router();
  //private _async = async;
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
    const TBLprefix = process.env.TBL_PREFIX;
    const error_response : any = JSON.stringify({status : 0 , message : 'Could not process request!'});

    // roots --------------------------------------------------------------------------------------
    this._router.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.status(200).json(this._controller.defaultMethod());
    });

    
    // Authenticate --------------------------------------------------------------------------------------
    this._router.post('/auth', (req: Request, res: Response, next: NextFunction) => {
        
      try{

        const meta_data : any = req.body;

        let login_detail : { username: string, password : string } = {
                        username : meta_data.username,
                        password : meta_data.password
                    }
       let password_request_encoded : string = this._sha1(login_detail.password); 
       try{
        let query : string = ` SELECT * FROM ${TBLprefix}users WHERE username LIKE '${login_detail.username}' AND password  LIKE '${password_request_encoded}' `;


        DBconnect.query( query, function( err : Array<any>,  rows : Array<any>, fields : Array<any> ) {
              if (err){
                res.status(400).send(error_response);
              }else{
                res.send(JSON.stringify({status : 1 , rows : rows}));
              }
          }); 
        }catch( err  : any ){
          res.status(400).send(error_response);
        } 
        
      }catch( err : any ){
        res.status(400).send(error_response);
      }
    });

    // END --------------------------------------------------------------------------------------
  }
}

export = new LoginRouter().router;