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
    name : string;
    price : string;
    description : string;
    brand_id : number,
    featured_status : number;
    status : number;
}

const ProductsForm = () => {

    const formValuesDefault : formFields = {
        name : '',
        price : '',
        description : '',
        brand_id : -1,
        featured_status : 0,
        status : 1
    }

    const dispatch = useDispatch();
    const { id } = useParams<any>();
    const [ formValues, setFormValues ] = useState<formFields>(formValuesDefault);
    const [ listBrands, setListBrands ] = useState<any>({});
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

        if ( fieldName==='name'){
            setFormValues({...formValues, ...{ name : value } });
        }else  if ( fieldName==='description'){
            setFormValues({...formValues, ...{ description : value } });
        }else  if ( fieldName==='brand'){
            setFormValues({...formValues, ...{ brand_id : value } });
        }else  if ( fieldName==='price'){
            setFormValues({...formValues, ...{ price : value } });
        }else  if ( fieldName==='featured'){
            setFormValues({...formValues, ...{ featured_status : value } });
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
            .post(`${process.env.REACT_APP_api_url}/api/products/${actionName}`, formValuesRequest )
            .then( (response : any )=> {
                let result_response : any = response.data;

                if ( parseInt(result_response.status)===1 ){
                    let labeled : string = (actionTemp==='add') ? 'added' : 'udpated';
                    dispatch( showNotification(`${labeled} successfully!`) );

                    if ( actionTemp==='add' ){
                         setFormValues(formValuesDefault);
                         dispatch( showCounters('products') );
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


    const fecthListBrands = async () => {
        axios
        .post(`${process.env.REACT_APP_api_url}/api/brands/list`)
        .then( response => {
            let result_response : any = [], record_list : any = [];

            result_response = response.data;
            record_list = result_response.list;

            let all_brands_rows : any = [];

            for (const [key, value ]  of Object.entries(record_list) ) {
                let row : any = value;
                all_brands_rows[row.id] = value;
            }
            
            setListBrands( all_brands_rows );  

        })
        .catch((err : any ) => {
            setListBrands({});
        });
    }


    const getDetail = async ( id : string ) => {

        axios
        .post(`${process.env.REACT_APP_api_url}/api/products/list`, { id : id })
        .then( response => {
            let result_response : any = [], record_list : any = [];

            result_response = response.data;
            record_list = result_response.list;

            if ( result_response.status===1 ){
                const detailRow : any = record_list[0];
                
                setActionName('update');
                setFormValues({
                    name : detailRow.name,
                    price : detailRow.price,
                    description : detailRow.description,
                    brand_id : detailRow.brand_id,
                    featured_status : detailRow.featured_status,
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
        fecthListBrands();

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
                        <div className="boxx-head">product detail</div>
                        <div className="boxx-body">

                            <div className="form-group">
                                <input type="text" className="form-input" placeholder=" "  value={ formValues.name } onChange={ (e) => pushValue(e, 'name') }  ></input>
                                <label className="form-label">name</label>
                            </div>

                            <div className="form-group">
                                <input type="number" className="form-input" placeholder=" "  value={ formValues.price } onChange={ (e) => pushValue(e, 'price') }></input>
                                <label className="form-label">price</label>
                            </div>

                            <div className="form-group">
                                <textarea  className="form-input" placeholder=" "  value={ formValues.description } onChange={ (e) => pushValue(e, 'description') }></textarea>
                                <label className="form-label">description</label>
                            </div>

                        </div>
                    </div>

                    <div className="boxx mt-2">
                        <div className="boxx-head">additional detail</div>
                        <div className="boxx-body">

                            <div className="form-group">
                                <select className="form-input"  value={ formValues.brand_id } onChange={ (e) => pushValue(e, 'brand') }>
                                    <option value="-1">-select-</option>
                                    { Object.entries(listBrands).map( ( [key, row ] : any ) => (
                                        <option key={row.group_id} value={row.group_id}>{row.name}</option>
                                    ))}
                                </select>
                                <label className="form-label">brand name</label>
                            </div>

                            <div className="form-group">
                                <select className="form-input"  value={ formValues.featured_status } onChange={ (e) => pushValue(e, 'featured') }>
                                    <option value="0">no</option>
                                    <option value="1">yes</option>
                                </select>
                                <label className="form-label">Featured Status</label>
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
                        <button type="button" className="btn-cell--primary btn-cell--md full-width" onClick={ (e) => submitForm(e) }>{buttonLabel}</button>
                    </div>
                    
                </form>
            </div>

        </div>
    )
}

export default ProductsForm;