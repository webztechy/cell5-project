import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; 

import Utilities from './../helpers/Utilities';
import config from './../helpers/Config';

import ProductsBulk from './ProductsBulk';
import { showNotification  } from '../actions';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export interface pagesInfoFields {
    current_page : number;
    per_page: number;
    total_pages : number;
    total_records : number;
    status : number;
}

export interface filterValuesFields {
    page : number;
    limit : number;
    brand_id : number,
    featured : number;
    status : number;
    name : string;
}

export interface tableHeadSort {
    name : number;
    featured_status : number,
    price : number;
    status : number;
    date_created : number;
}

const Products = () => {

    const pagesInfoTemp  : pagesInfoFields = {
        current_page : 0,
        per_page: 0,
        total_pages :0,
        total_records : 0,
        status : 0
    }

    const filterValuesOption : filterValuesFields = {
        page : 1,
        limit : config.page_limit,
        brand_id : 0,
        featured: -1,
        status :-1,
        name : ''
    }

    const tableHeadLabelsSort : tableHeadSort = {
        name : 1,
        featured_status : 0,
        price : 0,
        status : 0,
        date_created :0,
    }

    const dispatch = useDispatch();
    const [ listBrands, setListBrands ] = useState<any>({});
    const [ list, setList ] = useState<any>([]);
    const [ pagesInfo, setPagesInfo ] = useState<pagesInfoFields>(pagesInfoTemp);
    const [ pagesFilter, setPagesFilter ] = useState<filterValuesFields>(filterValuesOption);
    const [ tableHeadSort, setTableHeadSort ] = useState<tableHeadSort>(tableHeadLabelsSort);
    const [ pageLimit, setPageLimit ] = useState<any>( Utilities.pageLimit() );
    const [ bulkActionSelected, setBulkActionSelected ] = useState<number>(0);
    const [ choosenID, setChoosenID ] = useState<any>([]);
    const [ popupClass, setPopupClass ] = useState<string>('');

   
    const pushValue = (e : any, fieldName : string ) =>{
        fieldName = fieldName.toLowerCase();
        let value : any = e.target.value;

        if ( fieldName==='brand'){
            setPagesFilter({...pagesFilter, ...{ brand_id : value } });
        }else  if ( fieldName==='status'){
            setPagesFilter({...pagesFilter, ...{ status : value } });
        }else  if ( fieldName==='featured'){
            setPagesFilter({...pagesFilter, ...{ featured : value } });
        }else  if ( fieldName==='name'){
            setPagesFilter({...pagesFilter, ...{ name : value } });
        }else  if ( fieldName==='page'){
            setPagesFilter({...pagesFilter, ...{ page : value } });
        }else  if ( fieldName==='limit'){
            setPagesFilter({...pagesFilter, ...{ limit : value } });
        } 

    }

    const closeBulkPopUp = () => {
        setPopupClass('');
        setBulkActionSelected(0);
    }

    const messagePopup = ( title : string = 'Error', message : string = '' ) => {
        confirmAlert({
            title: title,
            message: message,
            buttons: [
                { label: 'Close',  onClick: () => {} }
            ]
        }); 
    }

    const _pushID = (e : any) =>{
        let value : number = e.target.value;
        let updatedID : any = choosenID;

        if ( e.currentTarget.checked){
            updatedID.push(value);
        }else{
            updatedID = updatedID.filter(function(e : any) { return e !== value })
        }

        updatedID = updatedID.filter(function(item : any, pos : number, self : any ) {
            return self.indexOf(item) == pos;
        });

        setChoosenID(updatedID);
    }

    const updateSort = ( fieldName : string = '' ) => {
        
        if ( !Utilities.isEmpty(fieldName) ){
            let tableHeadSortTemp : any  = tableHeadSort;

            if (tableHeadSortTemp.hasOwnProperty(fieldName)) {

                let currentSort : number = tableHeadSortTemp[fieldName];
                if (currentSort===0){ currentSort = 1; }
                else if (currentSort===1){ currentSort = 2;  }
                else if (currentSort===2){  currentSort = 0; }

                if ( fieldName=='name'){
                    tableHeadSortTemp = { ...tableHeadSortTemp, ...{ name : currentSort } };
                }else if ( fieldName=='price'){
                    tableHeadSortTemp = { ...tableHeadSortTemp, ...{ price : currentSort } };
                }else if ( fieldName=='featured_status'){
                    tableHeadSortTemp = { ...tableHeadSortTemp, ...{ featured_status : currentSort } };
                }else if ( fieldName=='status'){
                    tableHeadSortTemp = { ...tableHeadSortTemp, ...{ status : currentSort } };
                }else if ( fieldName=='date_created'){
                    tableHeadSortTemp = { ...tableHeadSortTemp, ...{ date_created : currentSort } };
                }

                let sortFieldsArray : any = [];
                for (const  [key, value]  of Object.entries(tableHeadSortTemp) ) {
                    let num : any = value, sortName : any = ' ASC ';
                    if ( num >=1 ){
                        sortName = ( num===1 )  ? ' ASC ' : ' DESC '; 
                        sortFieldsArray.push( `${key} ${sortName}` );
                    }
                }

                if ( sortFieldsArray.length>0 ){
                    setPagesFilter({...pagesFilter, ...{ sorting : sortFieldsArray.join(', ') } });
                }
                setTableHeadSort(tableHeadSortTemp);
            }
        }
    }
    
    const resetFilter = () => {
        setPagesFilter(filterValuesOption);
    }

    const bulkAction = (e : any) => {
        let value : number = e.target.value;

        if ( choosenID.length>0 ){
            if ( value==1){
                confirmAlert({
                    title: 'Delete Record?',
                    message: 'This will permanent delete the selected record.',
                    buttons: [
                        { label: 'Yes',  onClick: () => deleteList(choosenID.join(',')) },
                        { label: 'No', onClick: () => { setBulkActionSelected(0) } }
                    ]
                }); 
                
            }else if ( value==2 ){
                setPopupClass('show');
            }

            setBulkActionSelected(value);
            return false;
        }

        setBulkActionSelected(0);
        
    }

    const deleteList = async ( ids : string ) =>{
        
        if ( !Utilities.isEmpty(ids) ){
            
            axios
            .post(config.api_url+'/api/products/delete', { ids : ids } )
            .then( (response : any )=> {
                let result_response : any = response.data;
  
                if ( parseInt(result_response.status)===1 ){
                    //messagePopup('Success', 'Delete successfully!');
                    fecthList();
                    dispatch( showNotification('Delete successfully!') );
                }else{
                    messagePopup('Error', 'Could not delete record!');
                }
            })
            .catch( (err : any ) => {
                messagePopup('Error', 'Could not delete record!');
            }); 

        }

        setBulkActionSelected(0);
    }


    const getBrandName = ( id : number ) : string => {
        let brand_name : string = '-';
        if (listBrands.hasOwnProperty(id)) {
            brand_name = listBrands[id].name;
        }
        return brand_name;
    }

    const fecthList = async () => {

        axios
        .post(config.api_url+'/api/products/list', pagesFilter )
        .then( ( response : any ) => {
            let result_response : any = [], record_list : any = [];

            result_response = response.data;
            record_list = result_response.list;

            for (const [key, value] of Object.entries(record_list)) {
                let row : any = value;

                const localTime : any = moment.utc(row.date_created);  
                const local_time = moment(new Date(localTime)).format('DDMMMYY hh:mm:ss').toLocaleString();   
    
                const date_formatted : any = { date_formatted : local_time };
                record_list[key] = { ...row, ...date_formatted };

            }

            //record_list = Utilities.toNormalArrayObject(record_list);

            const pagesInfoTemp : pagesInfoFields = {
                current_page : result_response.current_page,
                per_page: result_response.per_page,
                total_pages : result_response.total_pages,
                total_records : result_response.total_records,
                status : result_response.status
            }

            setPagesInfo( pagesInfoTemp );
            setList( record_list );  

        })
        .catch( (err : any ) => {
            setPagesInfo( pagesInfoTemp );
            setList({});
        }); 
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
            
            //record_list = Utilities.toNormalArrayObject(record_list);
            setListBrands( all_brands_rows );  

        })
        .catch((err : any ) => {
            setListBrands({});
        });
    }


    const updateListBulk = ( values : Array<any> ) =>{
   
        if ( Object.keys(values).length>0 ){

            let valuesRequest : Array<any> = {...values, ...{ id : choosenID.join(',') } };

            axios
            .post(config.api_url+'/api/products/update?bulk=1', valuesRequest )
            .then( (response : any )=> {
                let result_response : any = response.data;

                if ( parseInt(result_response.status)===1 ){
                    //messagePopup('Success', 'Updated successfully!');
                    fecthList();
                    closeBulkPopUp();

                    dispatch( showNotification('Updated successfully!') );
                }else{
                    messagePopup('Error', 'Could not update record!');
                }
            })
            .catch( (err : any ) => {
                messagePopup('Error', 'Could not update record!');
            }); 

        }
    }
    
    useEffect( () => {
        fecthListBrands();
    }, []);

    useEffect( () => {
        fecthList();
    },[pagesFilter]);

    return (
        <div className="fade-in">

            <ul className="ul-table--filter">
                <li>Product List</li>
                <li className="ul-table--filter--option">
                    filter by
                    <select className="cell-input" value={pagesFilter.brand_id} onChange={ (e) => pushValue( e, 'brand') }>
                        <option value="-1">brand name</option>
                        { Object.entries(listBrands).map( ( [key, row ] : any ) => (
                             <option key={row.group_id} value={row.group_id}>{row.name}</option>
                         ))}
                    </select>
                   
                    <select className="cell-input" value={pagesFilter.featured} onChange={ (e) => pushValue( e, 'featured') }>
                        <option value="-1">featured</option>
                        <option value="1">yes</option>
                        <option value="0">no</option>
                    </select>

                    <select className="cell-input" value={pagesFilter.status} onChange={ (e) => pushValue( e, 'status') }>
                        <option value="-1">status</option>
                        <option value="1">active</option>
                        <option value="0">inactive</option>
                    </select>

                    <input type="text" className="cell-input" placeholder="type name here.." value={pagesFilter.name} onChange={ (e) => pushValue( e, 'name') }></input>
                    
                    <button type="button" className="btn-cell--primary" onClick={ (e) => resetFilter() }>reset</button>
                </li>
            </ul>

            <ul className="ul-table ul-table--head ul-table--products">
                <li className="ul-table--tr">
                    <div></div>
                    <div className={ ( (tableHeadSort.name===1) ? 'sort-asc' : (tableHeadSort.name===2) ? 'sort-desc' : '' )} onClick={ () => updateSort('name') } >Name</div>
                    <div className="sort-none">Brand</div>
                    <div className={ ( (tableHeadSort.price===1) ? 'sort-asc' : (tableHeadSort.price===2) ? 'sort-desc' : '' )} onClick={ () => updateSort('price') } >Price</div>
                    <div className={ ( (tableHeadSort.featured_status===1) ? 'sort-asc' : (tableHeadSort.featured_status===2) ? 'sort-desc' : '' )} onClick={ () => updateSort('featured_status') } >Featured</div>
                    <div className={ ( (tableHeadSort.status===1) ? 'sort-asc' : (tableHeadSort.status===2) ? 'sort-desc' : '' )} onClick={ () => updateSort('status') } >Status</div>
                    <div className={ ( (tableHeadSort.date_created===1) ? 'sort-asc' : (tableHeadSort.date_created===2) ? 'sort-desc' : '' )} onClick={ () => updateSort('date_created') }  >Date Created</div>
                    <div className="sort-none"></div>
                </li>
            </ul>


            <ul className="ul-table ul-table--body ul-table--products">
                { 
                    ( pagesInfo.status===1 && pagesInfo.total_pages>0 ) ?
                        (
                            Object.entries(list).map( ( [key, row ] : any ) => (
                            <li  key={row.group_id} className="ul-table--tr">
                                <div><input type="checkbox" className="cell-checkbox" value={row.group_id} onChange={ (e) => _pushID(e) }></input></div>
                                <div>{row.name}</div>
                                <div>{getBrandName(row.brand_id)}</div>
                                <div>{Utilities.number_format(row.price, 2)}</div>
                                <div>{Utilities.featuredLabels(row.featured_status)}</div>
                                <div>{Utilities.statusLabels(row.status)}</div>
                                <div>{row.date_formatted}</div>
                                <div><Link to={`/products-form/${btoa(row.group_id)}`} className="btn-record--edit"></Link></div>
                            </li>
                            ))
                    ) : 
                    ( <li className="no-record">no record available</li> )
                }
            </ul>

            <ul className="ul-table ul-table--footer">
                {
                    ( pagesInfo.status===1 && pagesInfo.total_pages>0 ) ?
                        (
                         <li className="ul-table--tr">

                            <div className="ul-table--footer__actions">
                                bulk action
                                <select className="cell-input" value={bulkActionSelected} onChange={ (e) => bulkAction(e) }>
                                    <option value="0">---</option>
                                    <option value="1">delete</option>
                                    <option value="2">edit</option>
                                </select>
                            </div>

                            <div className="ul-table--footer__limit">
                                per page
                                <select className="cell-input" value={pagesFilter.limit} onChange={ (e) => pushValue( e, 'limit') } >
                                    { 
                                       pageLimit.map( ( limit : number ) =>  { 
                                           return <option key={limit}  value={limit}>{limit}</option>
                                       })
                                    }
                                </select>
                            </div>
                            <div className="ul-table--footer__pager">
                                page
                                <select className="cell-input" value={pagesFilter.page} onChange={ (e) => pushValue( e, 'page') } >
                                    {
                                       ( Utilities.rangeArray(1, pagesInfo.total_pages ).map( ( page : number ) =>  { 
                                            return <option key={page} value={page}>{page}</option> 
                                       }))
                                    }
                                </select>
                            </div>

                            <div className="ul-table--footer__page-info">{pagesInfo.current_page} / {pagesInfo.total_pages} pages</div>
                        </li>
                        ) : ''
                }
            </ul>


            <ProductsBulk
                    popupClass={popupClass}
                    closeBulkPopUp={closeBulkPopUp}
                    listBrands={listBrands}
                    listCounterChoosen={choosenID.length}
                    updateListBulk={updateListBulk}
            ></ProductsBulk>

        </div>
    )
}

export default Products;