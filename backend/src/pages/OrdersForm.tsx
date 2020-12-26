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
    order_number : string;
    price : string;
    items : string;
}

export interface rowFields{
    id : number
    name : string;
    qty : number, 
    price : number;
}

export interface itemFields{
    id : number
    name : string;
    price : number;
}


const OrdersForm = () => {

    const rowFieldsDefault : Array<rowFields> = [];

    /* {
        id : 1,
        name : 'item 1',
        qty : 1,
        price : 20
    },
     */

    const formValuesDefault : formFields = {
        order_number : '',
        price : '',
        items : ''
    }

    const dispatch = useDispatch();
    const { id } = useParams<any>();
    const [ formValues, setFormValues ] = useState<formFields>(formValuesDefault);
    const [ actionName, setActionName ] = useState<string>('add');
    const [ buttonLabel, setButtonLabel ] = useState<string>('submit');
    const [ choosenID, setChoosenID ] = useState<string>('0');

    const [ addedItems, setAddedItems ] = useState<Array<itemFields>>([]);
    const [ popupItemClass, setPopupItemClass ] = useState<string>('');

    const [ listProducts, setListProducts] = useState<any>([]);
    
    const messagePopup = ( title : string = 'Error', message : string = '' ) => {
        confirmAlert({
            title: title,
            message: message,
            buttons: [
                { label: 'Close',  onClick: () => {} }
            ]
        }); 
    }
   
    const [ itemsidTemp, setItemsidTemp ] = useState<string>('');
    const [ listItems, setListItems ] = useState<Array<rowFields>>(rowFieldsDefault);
    const [ gtotalPrice, setGTotalPrice ] = useState<number>(0);


    const pushValue = (e : any, fieldName : string ) =>{
        fieldName = fieldName.toLowerCase();
        let value : any = e.target.value;

        if ( fieldName==='order_number'){
            setFormValues({...formValues, ...{ order_number : value } });
        }
    }


    const totalPrice = () => {
        let totalPrice : number = 0;
     
        for (const [key, row] of Object.entries(listItems)) {
            totalPrice =  totalPrice + ( row.price * row.qty );
        }

        setGTotalPrice(totalPrice);
    }

    const updateItemsProceRow = ( e : any, id : number, action : string ) =>{
        let value : number = e.target.value;
        let listItemsTemp : any = [];

        if ( action==='price'){
            for (const [key, row] of Object.entries(listItems)) {
                if (row.hasOwnProperty('id')) {
                    if (row.id===id){
                        listItemsTemp.push({ ...row,  price : value });
                    }else{
                        listItemsTemp.push(row);
                    }
                }
            }
            setListItems(listItemsTemp);

        }else if ( action==='qty'){
            for (const [key, row] of Object.entries(listItems)) {
                if (row.hasOwnProperty('id')) {
                    if (row.id===id){
                        listItemsTemp.push({ ...row,  qty : value });
                    }else{
                        listItemsTemp.push(row);
                    }
                }
            }
            setListItems(listItemsTemp);

        }else if (action==='delete'){

            for (const [key, row] of Object.entries(listItems)) {
                if (row.hasOwnProperty('id')) {
                    if (row.id!==id){
                        listItemsTemp.push(row);
                    }
                }
            }
            setListItems(listItemsTemp);
        }

        if ( listItemsTemp.length>0 ){

            let totalPrice : number = 0;
            let items_meta : any = [];
            for (const [key, row] of Object.entries(listItemsTemp)) {
                let row_item : any = row;
                items_meta.push(`${row_item.id}:${row_item.qty}:${row_item.price}`);
                totalPrice =  totalPrice + ( row_item.price * row_item.qty );
            }

            setFormValues({...formValues, ...{ price : totalPrice.toString(), items : items_meta.join("|") } });
        }
        
    }

    const fecthList = async ( id : string) => {

        if ( !Utilities.isEmpty(id) ){
            axios
            .post(`${process.env.REACT_APP_api_url}/api/products/list`, { id : id } )
            .then( ( response : any ) => {
                let result_response : any = [], record_list : any = [], record_temp : any = {};

                result_response = response.data;
                record_list = result_response.list;
                
                for (const [key, row] of Object.entries(record_list)) {
                    let row_item : any = row;
                    record_temp[row_item.id] = row_item;
                } 

                let listItemsTemp : any = [];
                for (const [key, row] of Object.entries(listItems)) {
                    if (row.hasOwnProperty('id')) {
                        listItemsTemp.push({ ...row,  name : record_temp[row.id].name });
                    }
                } 

                setListItems(listItemsTemp);
            })
            .catch( (err : any ) => {
    
            }); 
        }
    }


    const filterItems = (e : any) => {

        let keywords : string = e.target.value;

        axios
        .post(`${process.env.REACT_APP_api_url}/api/products/list`, { name : keywords } )
        .then( ( response : any ) => {
            let result_response : any = [], record_list : any = [];

            result_response = response.data;
            record_list = result_response.list;
            
            if ( Object.keys(record_list).length>0 ){
                setListProducts(record_list);
            }else{
                setListProducts({});

            }

        })
        .catch( (err : any ) => {
            setListProducts({});
        }); 
    }

    const insertItem = ( id: any, name : any, price : any ) => { 

        let listItemsTemp : any = [] = listItems;
        let itemsidTempArr : Array<any> = itemsidTemp.split(',');
        

        if (  !itemsidTempArr.includes(id) ){
           
            listItemsTemp.push({ id : id , name : name, qty : 1, price : price });
            itemsidTempArr.push(id);


            setListItems(listItemsTemp);
            setItemsidTemp(itemsidTempArr.join(","));

            
            let totalPrice : number = 0;
            let items_meta : any = [];
            for (const [key, row] of Object.entries(listItemsTemp)) {
                let row_item : any = row;
                items_meta.push(`${row_item.id}:${row_item.qty}:${row_item.price}`);
                totalPrice =  totalPrice + ( row_item.price * row_item.qty );
            }

            setFormValues({...formValues, ...{ price : totalPrice.toString(), items : items_meta.join("|") } });

        }else{
            messagePopup('Info', 'Item already added in the list!');
        }
       
        showItemsPopup(0);
    }

    const getDetail = async ( id : string ) => {
        
        axios
        .post(`${process.env.REACT_APP_api_url}/api/orders/list`, { id : id })
        .then( response => {
            let result_response : any = [], record_list : any = [];

            result_response = response.data;
            record_list = result_response.list;

            if ( result_response.status===1 ){
                const detailRow : any = record_list[0];
                
                setActionName('update');

                setFormValues({
                    order_number : detailRow.order_number,
                    price : detailRow.price,
                    items : detailRow.items
                });

                setGTotalPrice(detailRow.price);

                let itemsDB : any = detailRow.items; //Array<rowFields> : 
                let itemsExtract : any = [] = itemsDB.split("|");

                let listItemsTemp : any = [];
                let items_ids : Array<number> = [];

                for (const [key, row] of Object.entries(itemsExtract)) {
                    let row_value : any = row;
                    let itemsExtractItems : Array<any> = row_value.split(':');
                    
                    listItemsTemp.push({ id : itemsExtractItems[0] , name : itemsExtractItems[0], qty : itemsExtractItems[1], price : itemsExtractItems[2] });
                    items_ids.push( itemsExtractItems[0] );
                }
                
                setListItems(listItemsTemp);
                setItemsidTemp(items_ids.join(","));
            
            }else{
                messagePopup('Error', 'Could not get record!');
            }

        })
        .catch((err : any ) => {
            messagePopup('Error', 'Could not get record!');
        }); 

    }


    const submitForm = (e : any ) => {

        if ( Object.keys(formValues).length>0 ){

            //console.log(formValues);

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
            .post(`${process.env.REACT_APP_api_url}/api/orders/${actionName}`, formValuesRequest )
            .then( (response : any )=> {
                let result_response : any = response.data;

                if ( parseInt(result_response.status)===1 ){
                    let labeled : string = (actionTemp==='add') ? 'added' : 'udpated';
                    dispatch( showNotification(`${labeled} successfully!`) );

                    if ( actionTemp==='add' ){
                         setFormValues(formValuesDefault);
                         dispatch( showCounters('orders') );
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

    const showItemsPopup = ( action : number ) => {
        let actionClass : string = ( action===1) ? 'show' : '';
        setPopupItemClass(actionClass);
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
            setListItems(rowFieldsDefault);
        }
        
    }, [id]);


    useEffect( () => {
        if ( typeof id!=='undefined' ){
            const decodedID : any = id;
            const encodedID : string = atob(decodedID);
            
            setChoosenID( encodedID );
            getDetail( encodedID );
        }
        
    }, []);

    useEffect( () => {
        totalPrice();
    }, [listItems]);


    useEffect( () => {
        fecthList(itemsidTemp);

    }, [itemsidTemp]);



    return (
        <div className="fade-in order-form-content">
            
            <div className="boxx-center boxx-md">
                
                <form action="" className="form-cell">
                    <div className="boxx">
                        <div className="boxx-head">order detail</div>
                        <div className="boxx-body">

                            
                            <div className="columns clm-3">
                                <div className="form-group">
                                    <input type="text" className="form-input" placeholder=" " value={ formValues.order_number } onChange={ (e) => pushValue(e, 'order_number') } ></input>
                                    <label className="form-label">order number</label>
                                </div>
                            </div>


                            <ul className="list-order--items" >
                                <li className="list-order--items-head">
                                    <div>item name</div>
                                    <div>quantity</div>
                                    <div>price</div>
                                    <div>sub total</div>
                                    <div></div>
                                </li>
                            {   
                                (listItems.length>0) ?
                                 
                                    (
                                        listItems.map( ( row : any  ) => (
                                        <li key={row.id}>
                                            <div>{row.name}</div>
                                            <div><input type="number" value={row.qty}  onChange={ (e) => updateItemsProceRow(e, row.id, 'qty' ) }/></div>
                                            <div><input type="number" value={row.price}  onChange={ (e) => updateItemsProceRow(e, row.id, 'price' ) } /></div>
                                            <div><input type="number" value={row.price * row.qty}  readOnly /></div>
                                            <div><span  className="btn-remove--item" onClick={ (e) => updateItemsProceRow(e, row.id, 'delete' ) }></span></div>
                                        </li>
                                            ))
                                    )
                                    :
                                    ( <li className="no-record">no items added!</li> )
                            }
                            </ul>

                            <div className="total-price">
                                <div>total :</div>
                                <div>{Utilities.number_format(gtotalPrice, 2)} USD</div>
                            </div>

                            <div className="mt-2 mb-4">
                                <button type="button" className="btn-add--item" onClick={ (e) => showItemsPopup(1) }>add item</button>
                            </div>
                                

                        </div>
                    </div>
                  
                    <div className="mt-3">
                        <button type="button" className="btn-cell--primary btn-cell--md full-width"  onClick={ (e) => submitForm(e) }>{buttonLabel}</button>
                    </div>
                    
                </form>
            </div>



            <div className="modal-cell-wrap">

                <div className={ `modal-cell show- ${popupItemClass}` }>
                    <div className="modal-cell--content">
                        <div className="modal-cell--content__head">
                            Select Item to Add
                            <div className="btn-modal-close" onClick={ () =>  showItemsPopup(0) }>x</div>
                        </div>
                        <div className="modal-cell--content__body">

                                <div  className="form-cell">
                                    <div className="form-group">
                                        <input type="text" className="form-input" placeholder=" "  onChange={ (e) => filterItems(e) } ></input>
                                        <label className="form-label">item name</label>
                                    </div>
                                </div>

                                <ul className="ul-items-producs--filter">
                                    {
                                         Object.entries(listProducts).map( ( [key, row ] : any ) => (
                                            <li key={row.group_id}>
                                                <div>{row.name}</div>
                                                <div>{Utilities.number_format(row.price, 2)}</div>
                                                <div><input type="radio" value={row.group_id} name="item" onChange={ (e) => insertItem(row.group_id, row.name, row.price ) } /></div>
                                            </li>
                                         ))
                                    }
                                </ul>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default OrdersForm;