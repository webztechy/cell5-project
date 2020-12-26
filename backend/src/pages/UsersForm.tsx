import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import Utilities from './../helpers/Utilities';
import config from './../helpers/Config';
import { useDispatch } from 'react-redux';

import { confirmAlert } from 'react-confirm-alert'; 
import { showCounters, showNotification  } from '../actions';

export interface formFields{
    username : string;
    password : string;
    first_name : string;
    last_name : string;
    address : string;
    contact_number : string;
    email : string;
    type : number;
    status : number;
}

const UsersForm = () => {

    const formValuesDefault : formFields = {
        username : '',
        password :'',
        first_name : '',
        last_name : '',
        address : '',
        contact_number : '',
        email : '',
        type : 2,
        status : 1
    }

    const dispatch = useDispatch();
    const { id } = useParams<any>();
    const [ formValues, setFormValues ] = useState<formFields>(formValuesDefault);
    const [ actionName, setActionName ] = useState<string>('add');
    const [ buttonLabel, setButtonLabel ] = useState<string>('submit');
    const [ choosenID, setChoosenID ] = useState<string>('0');
    
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
        }else  if ( fieldName==='first_name'){
            setFormValues({...formValues, ...{ first_name : value } });
        }else  if ( fieldName==='last_name'){
            setFormValues({...formValues, ...{ last_name : value } });
        }else  if ( fieldName==='address'){
            setFormValues({...formValues, ...{ address : value } });
        }else  if ( fieldName==='contact_number'){
            setFormValues({...formValues, ...{ contact_number : value } });
        }else  if ( fieldName==='email'){
            setFormValues({...formValues, ...{ email : value } });
        }else  if ( fieldName==='type'){
            setFormValues({...formValues, ...{ type : value } });
        }else  if ( fieldName==='status'){
            setFormValues({...formValues, ...{ status : value } });
        }
    }

    const submitForm = (e : any ) => {

        if ( Object.keys(formValues).length>0 ){
            
            let actionTemp : string = actionName.toLocaleLowerCase();
            let formValuesRequest : any = formValues;
            
            if ( actionTemp==='add' ){
                const utcTime : any = Utilities.currentUTCTime();
                const date_created = { date_created : moment.utc(utcTime).format('YYYY-MM-DD HH:mm:ss') };
                
                formValuesRequest = {...formValues, ...date_created };

            }else if ( actionTemp==='update' ){
                formValuesRequest = {...formValues, ...{ id : choosenID } };
            }

            axios
            .post(`${process.env.REACT_APP_api_url}/api/users/${actionName}`, formValuesRequest )
            .then( (response : any )=> {
                let result_response : any = response.data;

                if ( parseInt(result_response.status)===1 ){
                    let labeled : string = (actionTemp==='add') ? 'added' : 'udpated';
                    dispatch( showNotification(`${labeled} successfully!`) );

                    if ( actionTemp==='add' ){
                         setFormValues(formValuesDefault);
                         dispatch( showCounters('users') );
                    }

                }else{
                    messagePopup('Error', 'Could not add record!');
                }

            })
            .catch( (err : any ) => {
                messagePopup('Error', 'Could not add record!');
            }); 

        }
    }

    const getDetail = async ( id : string ) => {

        axios
        .post(`${process.env.REACT_APP_api_url}/api/users/list`, { id : id })
        .then( response => {
            let result_response : any = [], record_list : any = [];

            result_response = response.data;
            record_list = result_response.list;

            if ( result_response.status===1 ){
                const detailRow : any = record_list[0];
                
                setActionName('update');

                setFormValues({
                    username : detailRow.username,
                    password : '', //detailRow.password,
                    first_name : detailRow.first_name,
                    last_name : detailRow.last_name,
                    address : detailRow.address,
                    contact_number : detailRow.contact_number,
                    email : detailRow.email,
                    type : 2,
                    status : detailRow.status,
                });

            }else{
                messagePopup('Error', 'Could not get record!');
            }

        })
        .catch((err : any ) => {
            messagePopup('Error', 'Could not get record!');
        }); 
    }

    useEffect( () => {
    
        if ( typeof id!=='undefined' ){
            setActionName('update');
            setButtonLabel('update');
        }else{
            setActionName('add');
            setChoosenID('0');
            setButtonLabel('submit');
            setFormValues(formValuesDefault);
        }
        
    }, [id]);

    useEffect( () => {
        if ( typeof id!=='undefined' ){
            const decodedID : any = id;
            const encodedID : string = atob(decodedID);
            setChoosenID( encodedID );
            getDetail( atob(decodedID) );
        }
        
    }, []);

    return (
        <div className="fade-in">
            
            <div className="boxx-center">
                
                <form action="" className="form-cell">
                    <div className="boxx">
                        <div className="boxx-head">user detail</div>
                        <div className="boxx-body">

                            <div className="form-group">
                                <input type="text" className="form-input" placeholder=" " value={ formValues.first_name } onChange={ (e) => pushValue(e, 'first_name') } ></input>
                                <label className="form-label">first name</label>
                            </div>

                            <div className="form-group">
                                <input type="text" className="form-input" placeholder=" " value={ formValues.last_name } onChange={ (e) => pushValue(e, 'last_name') } ></input>
                                <label className="form-label">last name</label>
                            </div>

                            <div className="form-group">
                                <input type="text" className="form-input" placeholder=" " value={ formValues.email } onChange={ (e) => pushValue(e, 'email') } ></input>
                                <label className="form-label">email</label>
                            </div>

                            <div className="form-group">
                                <input type="text" className="form-input" placeholder=" " value={ formValues.contact_number } onChange={ (e) => pushValue(e, 'contact_number') } ></input>
                                <label className="form-label">contact</label>
                            </div>

                            <div className="form-group">
                                <input type="text" className="form-input" placeholder=" " value={ formValues.address } onChange={ (e) => pushValue(e, 'address') } ></input>
                                <label className="form-label">address</label>
                            </div>

                        </div>
                    </div>

                    <div className="boxx">
                        <div className="boxx-head">credentail detail</div>
                        <div className="boxx-body">

                            <div className="form-group">
                                <input type="text" className="form-input" placeholder=" " value={ formValues.username } onChange={ (e) => pushValue(e, 'username') } ></input>
                                <label className="form-label">username</label>
                            </div>

                            <div className="form-group">
                                <input type="password" className="form-input" placeholder=" " value={ formValues.password } onChange={ (e) => pushValue(e, 'password') } ></input>
                                <label className="form-label">password</label>
                            </div>

                            <div className="form-group">
                                <select className="form-input" value={ formValues.status } onChange={ (e) => pushValue(e, 'status') }>
                                    <option value="1">active</option>
                                    <option value="0">inactive</option>
                                </select>
                                <label className="form-label">Status</label>
                            </div>

                        </div>
                    </div>

                  
                    <div className="mt-3">
                        <button type="button" className="btn-cell--primary btn-cell--md full-width" onClick={ (e) => submitForm(e) }>{buttonLabel}</button>
                    </div>
                    
                </form>
            </div>

        </div>
    )
}

export default UsersForm;