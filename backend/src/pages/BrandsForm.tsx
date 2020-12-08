import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import Utilities from './../helpers/Utilities';
import config from './../helpers/Config';
import { useDispatch } from 'react-redux';

import { confirmAlert } from 'react-confirm-alert'; 
import { showNotification  } from '../actions';

export interface formFields{
    name : string;
    description : string;
    status : number;
}

const BrandsForm = () => {

    const formValuesDefault : formFields = {
        name : '',
        description : '',
        status : 1
    }

    const dispatch = useDispatch();
    const { id } = useParams<any>();
    const [ formValues, setFormValues ] = useState<formFields>(formValuesDefault);
    const [ actionName, setActionName ] = useState<string>('add');
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

        if ( fieldName==='name'){
            setFormValues({...formValues, ...{ name : value } });
        }else  if ( fieldName==='description'){
            setFormValues({...formValues, ...{ description : value } });
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
            .post(`${config.api_url}/api/brands/${actionName}`, formValuesRequest )
            .then( (response : any )=> {
                let result_response : any = response.data;

                if ( parseInt(result_response.status)===1 ){
                    let labeled : string = (actionTemp==='add') ? 'added' : 'udpated';
                    dispatch( showNotification(`${labeled} successfully!`) );

                    if ( actionTemp==='add' ){
                         setFormValues(formValuesDefault);
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
        .post(config.api_url+'/api/brands/list', { id : id })
        .then( response => {
            let result_response : any = [], record_list : any = [];

            result_response = response.data;
            record_list = result_response.list;

            if ( result_response.status===1 ){
                const detailRow : any = record_list[0];
                
                setActionName('update');

                setFormValues({
                    name : detailRow.name,
                    description : detailRow.description,
                    status : detailRow.status
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
                        <div className="boxx-head">brand detail</div>
                        <div className="boxx-body">

                            <div className="form-group">
                                <input type="text" className="form-input" placeholder=" " value={ formValues.name } onChange={ (e) => pushValue(e, 'name') } ></input>
                                <label className="form-label">name</label>
                            </div>

                            <div className="form-group">
                                <textarea  className="form-input" placeholder=" " value={ formValues.description } onChange={ (e) => pushValue(e, 'description') } ></textarea>
                                <label className="form-label">description</label>
                            </div>

                            <div className="form-group">
                                <select className="form-input"  value={ formValues.status } onChange={ (e) => pushValue(e, 'status') }>
                                    <option value="1">active</option>
                                    <option value="0">inactive</option>
                                </select>
                                <label className="form-label">Status</label>
                            </div>


                        </div>
                    </div>
                  
                    <div className="mt-3">
                        <button type="button" className="btn-cell--primary btn-cell--md full-width" onClick={ (e) => submitForm(e) }>submit</button>
                    </div>
                    
                </form>
            </div>

        </div>
    )
}

export default BrandsForm;