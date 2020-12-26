import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import config from './../helpers/Config';
import { confirmAlert } from 'react-confirm-alert'; 
import Utilities from './../helpers/Utilities';
import { isLoggedin  } from '../actions';

export interface formFields{
    username : string;
    password : string;
}

const Login = () => {
    
    const formValuesDefault : formFields = {
        username : '',
        password : ''
    }

    const dispatch = useDispatch();
    const [ formValues, setFormValues ] = useState<formFields>(formValuesDefault);

    
    const messagePopup = ( title : string = 'Error', message : string = '' ) => {
        confirmAlert({
            title: title,
            message: message,
            buttons: [
                { label: 'Close',  onClick: () => {} }
            ]
        }); 
    }


    const pushValue = (e : any, fieldName : string ) =>{
        fieldName = fieldName.toLowerCase();
        let value : any = e.target.value;

        if ( fieldName==='username'){
            setFormValues({...formValues, ...{ username : value } });
        }else  if ( fieldName==='password'){
            setFormValues({...formValues, ...{ password : value } });
        }
    }

    const submitForm = (e : any ) => {
        e.preventDefault();

        if ( !Utilities.isEmpty(formValues.username) && !Utilities.isEmpty(formValues.password) ){
                
            axios
            .post(`${process.env.REACT_APP_api_url}/api/login/auth`, formValues )
            .then( response => {
                let result_response : any = [], record_list : any = [];
    
                result_response = response.data;
                console.log(result_response);

                if (result_response.status===1){

                     if (result_response.hasOwnProperty('rows')) {
                        sessionStorage.setItem(
                            "login_session",
                            JSON.stringify(result_response.rows)
                        );
                        dispatch( isLoggedin(1) );
                     }else{
                        messagePopup('Error', 'Username and password did not matched!');
                     }
                    
                }
    
            })
            .catch((err : any ) => {
                messagePopup('Error', 'Could not process request!');
            });
        
        }else{
            messagePopup('Error', 'Username and password is mandatory!');
        }

    }

    return (
        <div className="login-content fade-in">
            
            <div className="login-wrap">
                <div className="login-form-wrap">
                    
                    <div>
                        <form method="post" onSubmit={submitForm} >
                            <input type="text" className="input-cell" placeholder="username"  value={ formValues.username } onChange={ (e) => pushValue(e, 'username') } ></input>
                            <input type="password" className="input-cell" placeholder="password"  value={ formValues.password } onChange={ (e) => pushValue(e, 'password') } ></input>

                            <button type="submit" className="btn-login">login</button>
                        </form>
                    </div>

                </div>

                <div className="login-description-wrap">
                    
                    <div>
                        <h2>cell5 app</h2>
                        <ul className="login-notes">
                            <li className="login-notes--desc">Lorem ipsum dolor sit amet.</li>
                            <li className="login-notes--desc">Sed vulputate finibus metus.</li>
                            <li className="login-notes--desc">Suspendisse non lobortis orci.</li>
                            <li className="login-notes--desc">Etiam nisi risus, bibendum sed maximus vitae.</li>
                            <li className="login-notes--desc">Praesent tempor ligula dui, sed suscipit.</li>
                        </ul>
                     </div>

                </div>
            </div>

        </div>
    )
}

export default Login;