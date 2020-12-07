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
    const { id : string } = useParams<any>();
    const [ formValues, setFormValues ] = useState<formFields>(formValuesDefault);
    const [ listBrands, setListBrands ] = useState<any>({});
   
    //console.log(atob(id));

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

            //e.currentTarget.disabled  = true;

            const utcTime : any = Utilities.currentUTCTime();
            const date_created = { date_created : moment.utc(utcTime).format('YYYY-MM-DD HH:mm:ss') };
            let formValuesRequest : any = {...formValues, ...date_created };

            axios
            .post(config.api_url+'/api/products/add', formValuesRequest )
            .then( (response : any )=> {
                let result_response : any = response.data;

                if ( parseInt(result_response.status)===1 ){
                    dispatch( showNotification('Added successfully!') );
                    setFormValues(formValuesDefault);

                }else{
                    messagePopup('Error', 'Could not add record!');
                }

                //e.currentTarget.disabled  = false;
            })
            .catch( (err : any ) => {
                messagePopup('Error', 'Could not add record!');
                //e.currentTarget.disabled  = false;
            }); 

        }
    }

    const fecthListBrands = async () => {
        axios
        .post(config.api_url+'/api/brands/list')
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

    useEffect( () => {
        fecthListBrands();
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
                                    <option value="0">active</option>
                                    <option value="1">inactive</option>
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

export default ProductsForm;