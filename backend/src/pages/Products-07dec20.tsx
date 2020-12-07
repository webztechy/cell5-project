import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
//import jquery from 'jquery';

import Utilities from '../helpers/Utilities';
import config from '../helpers/Config';


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

      
    const [ list, setList ] = useState<any>([]);
    const [ pagesInfo, setPagesInfo ] = useState<pagesInfoFields>(pagesInfoTemp);
    const [ pagesFilter, setPagesFilter ] = useState<filterValuesFields>(filterValuesOption);
    const [ pageLimit, setPageLimit ] = useState<any>( Utilities.pageLimit() );

    const [ bulkCheck, setBulkCheck ] = useState<number>(0);
    
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

    const _headFilter = () => {
        fecthList();
    }

    const _bulkSelection = (e : any) =>{
        let value : any = e.target.value;
        value = ( parseInt(value)===0 ) ? 1 : 0;

        //const inputCheckboxElem = jquery('.ul-table--products > li input.cell-checkbox');
        if (value===1){
            //inputCheckboxElem.prop('checked', true);
        }else{
            //inputCheckboxElem.prop('checked', false);
        }

        setBulkCheck(value);
    }

    const fecthList = async () => {

        axios
        .post(config.api_url+'/api/products/list', pagesFilter )
        .then( response => {
            let result_response : any = [], record_list : any = [];

            result_response = response.data;
            record_list = result_response.list;

            for (const [key, value] of Object.entries(record_list)) {
                let row : any = value;

                const localTime : any = moment.utc(row.date_created);  
                const local_time = moment(new Date(localTime)).format('DDMMMYY hh:mm:ss').toLocaleString();   
    
                const date_formatted : any= { date_formatted : local_time };
                record_list[key] = { ...row, ...date_formatted };
            }

            record_list = Utilities.toNormalArrayObject(record_list);

            const pagesInfoTemp = {
                current_page : result_response.current_page,
                per_page: result_response.per_page,
                total_pages : result_response.total_pages,
                total_records : result_response.total_records,
                status : result_response.status
            }

            setPagesInfo( pagesInfoTemp );
            setList( record_list );  

        })
        .catch(err => {
            setPagesInfo( pagesInfoTemp );
            setList({});
        }); 
    }

    useEffect( () => {
        fecthList();
    },[pagesFilter]);

    return (
        <div className="fade-in">

            <ul className="ul-table--filter">
                <li>Product List</li>
                <li className="ul-table--filter--option">
                    filter by
                    <select className="cell-input" onChange={ (e) => pushValue( e, 'brand') }>
                        <option value="-1">brand name</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                    <select className="cell-input" onChange={ (e) => pushValue( e, 'status') }>
                        <option value="-1">status</option>
                        <option value="1">active</option>
                        <option value="0">inactive</option>
                    </select>
                    <select className="cell-input" onChange={ (e) => pushValue( e, 'featured') }>
                        <option value="-1">featured</option>
                        <option value="1">yes</option>
                        <option value="0">no</option>
                    </select>
                    <input type="text" className="cell-input" placeholder="type name here.." onChange={ (e) => pushValue( e, 'name') }></input>

                    <button type="button" className="btn-cell--primary" onClick={ () => _headFilter() }>submit</button>
                </li>
            </ul>

            <ul className="ul-table ul-table--head ul-table--products">
                <li className="ul-table--tr">
                    <div><input type="checkbox" className="cell-checkbox" value={ bulkCheck } onChange={ (e) => _bulkSelection(e) }></input></div>
                    <div className="sort-asc">Name</div>
                    <div className="sort-none">Brand</div>
                    <div className="sort-desc">price</div>
                    <div>Featured</div>
                    <div>Status</div>
                    <div>Date Created</div>
                </li>
            </ul>


            <ul className="ul-table ul-table--body ul-table--products">

                { Object.entries(list).map( ( [key, row ] : any ) => (
                <li  key={row.group_id} className="ul-table--tr">
                    <div><input type="checkbox" className="cell-checkbox" value={row.group_id} ></input></div>
                    <div>{row.name}</div>
                    <div>{row.brand_id}</div>
                    <div>{row.price}</div>
                    <div>{row.featured_status}</div>
                    <div>{row.status}</div>
                    <div>{row.date_formatted}</div>
                </li>
                ))}
            </ul>

            <ul className="ul-table ul-table--footer">
                {
                    ( pagesInfo.status===1 && pagesInfo.total_pages>0 ) ?
                        (
                         <li className="ul-table--tr">

                            <div className="ul-table--footer__actions">
                                bulk action
                                <select className="cell-input">
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

        </div>
    )
}

export default Products;