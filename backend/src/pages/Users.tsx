import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; 

import Utilities from './../helpers/Utilities';
import config from './../helpers/Config';

import { showCounters, showNotification  } from '../actions';
import { useDispatch } from 'react-redux';


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
    status : number;
    name : string;
}

export interface tableHeadSort {
    first_name : number;
    last_name : number;
    status : number;
    date_created : number;
}

const Users = () => {

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
        status :-1,
        name : ''
    }

    const tableHeadLabelsSort : tableHeadSort = {
        first_name : 1,
        last_name : 0,
        status : 0,
        date_created :0,
    }


    const dispatch = useDispatch();
    const [ list, setList ] = useState<any>([]);
    const [ pagesInfo, setPagesInfo ] = useState<pagesInfoFields>(pagesInfoTemp);
    const [ pagesFilter, setPagesFilter ] = useState<filterValuesFields>(filterValuesOption);
    const [ tableHeadSort, setTableHeadSort ] = useState<tableHeadSort>(tableHeadLabelsSort);
    const [ pageLimit, setPageLimit ] = useState<any>( Utilities.pageLimit() );
    const [ bulkActionSelected, setBulkActionSelected ] = useState<number>(0);
    const [ choosenID, setChoosenID ] = useState<any>([]);
    
    const pushValue = (e : any, fieldName : string ) =>{
        fieldName = fieldName.toLowerCase();
        let value : any = e.target.value;

        if ( fieldName==='name'){
            setPagesFilter({...pagesFilter, ...{ name : value } });
        }else  if ( fieldName==='status'){
            setPagesFilter({...pagesFilter, ...{ status : value } });
        }else  if ( fieldName==='page'){
            setPagesFilter({...pagesFilter, ...{ page : value } });
        }else  if ( fieldName==='limit'){
            setPagesFilter({...pagesFilter, ...{ limit : value } });
        } 

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

                if ( fieldName=='first_name'){
                    tableHeadSortTemp = { ...tableHeadSortTemp, ...{ first_name : currentSort } };
                }else if ( fieldName=='last_name'){
                    tableHeadSortTemp = { ...tableHeadSortTemp, ...{ last_name : currentSort } };
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
                
            }
            setBulkActionSelected(value);
            return false;
        }

        setBulkActionSelected(0);
        
    }

    const deleteList = async ( ids : string ) =>{
        
        if ( !Utilities.isEmpty(ids) ){
            
            axios
            .post(`${process.env.REACT_APP_api_url}/api/users/delete`, { ids : ids } )
            .then( (response : any )=> {
                let result_response : any = response.data;
  
                if ( parseInt(result_response.status)===1 ){
                    fecthList();
                    dispatch( showCounters('users') );
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

    const fecthList = async () => {

        axios
        .post(config.api_url+'/api/users/list', pagesFilter )
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

    useEffect( () => {
        fecthList();
    },[pagesFilter]);


    return (
        <div className="fade-in">

            <ul className="ul-table--filter">
                <li>User List</li>
                <li className="ul-table--filter--option">
                    filter by
                    <select className="cell-input" value={pagesFilter.status} onChange={ (e) => pushValue( e, 'status') }>
                        <option value="-1">status</option>
                        <option value="1">active</option>
                        <option value="0">inactive</option>
                    </select>
                    <input type="text" className="cell-input" placeholder="type name here.." value={pagesFilter.name} onChange={ (e) => pushValue( e, 'name') }></input>

                    <button type="button" className="btn-cell--primary" onClick={ (e) => resetFilter() }>reset</button>
                </li>
            </ul>

            <ul className="ul-table ul-table--head ul-table--users">
                <li className="ul-table--tr">
                    <div></div>
                    <div className={ ( (tableHeadSort.first_name===1) ? 'sort-asc' : (tableHeadSort.first_name===2) ? 'sort-desc' : '' )} onClick={ () => updateSort('first_name') }>First Name</div>
                    <div className={ ( (tableHeadSort.last_name===1) ? 'sort-asc' : (tableHeadSort.last_name===2) ? 'sort-desc' : '' )} onClick={ () => updateSort('last_name') }>Last Name</div>
                    <div className={ ( (tableHeadSort.status===1) ? 'sort-asc' : (tableHeadSort.status===2) ? 'sort-desc' : '' )} onClick={ () => updateSort('status') }>Status</div>
                    <div className={ ( (tableHeadSort.date_created===1) ? 'sort-asc' : (tableHeadSort.date_created===2) ? 'sort-desc' : '' )} onClick={ () => updateSort('date_created') }>Date Created</div>
                    <div className="sort-none"></div>
                </li>
            </ul>


            <ul className="ul-table ul-table--body ul-table--users">
            { 
                ( pagesInfo.status===1 && pagesInfo.total_pages>0 ) ?
                    (
                        Object.entries(list).map( ( [key, row ] : any ) => (
                        <li  key={row.group_id} className="ul-table--tr">
                            <div><input type="checkbox" className="cell-checkbox" value={row.group_id} onChange={ (e) => _pushID(e) }></input></div>
                            <div>{row.first_name}</div>
                            <div>{row.last_name}</div>
                            <div>{Utilities.statusLabels(row.status)}</div>
                            <div>{row.date_formatted}</div>
                            <div><Link to={`/users-form/${btoa(row.group_id)}`} className="btn-record--edit"></Link></div>
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

export default Users;