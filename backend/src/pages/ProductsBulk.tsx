import React, { useEffect, useState } from 'react';

export interface Props {
    closeBulkPopUp : any,
    listBrands : any,
    updateListBulk: any;
    popupClass : string;
    listCounterChoosen : number;
} 

export interface bulkFields{
    brand_id : number,
    status : number;
    featured_status : number;
    price : number;
}

const ProductsBulk : React.FC<Props>  = ( props ) => {

    let bulkFieldsTemp : bulkFields = {
        brand_id : -1,
        status : -1,
        featured_status : -1,
        price : 0
    }
    const [ bulkValues, setBulkValues ] = useState<bulkFields>(bulkFieldsTemp);
    const [ choosenValues, setChoosenValues ] = useState<bulkFields>(bulkFieldsTemp);

    const pushValue = (e : any, fieldName : string ) =>{
        fieldName = fieldName.toLowerCase();
        let value : any = e.target.value;

        if ( fieldName==='brand'){
            setBulkValues({...bulkValues, ...{ brand_id : value } });
        }else  if ( fieldName==='status'){
            setBulkValues({...bulkValues, ...{ status : value } });
        }else  if ( fieldName==='featured'){
            setBulkValues({...bulkValues, ...{ featured_status : value } });
        }else  if ( fieldName==='price'){
            setBulkValues({...bulkValues, ...{ price : value } });
        }

    }

    const submitUpdate = () => {
        let valuesTemp : any = {};
        
        for (const [key, value ]  of Object.entries(bulkValues) ) {
            let vall : any = value;
            if ( vall>=0 ){
                valuesTemp[key] = value;
            }
        }

        props.updateListBulk( valuesTemp );
    }

    useEffect( () => {
        setChoosenValues(bulkValues);

    }, [bulkValues])
    
    return (
        <div className="modal-cell-wrap">

                <div className={ `modal-cell show- ${props.popupClass} ` }>
                    <div className="modal-cell--content">
                        <div className="modal-cell--content__head">
                            Bulk Action
                            <div className="btn-modal-close" onClick={ () => props.closeBulkPopUp() }>x</div>
                        </div>
                        <div className="modal-cell--content__body">
                            
                            <form action="" className="form-cell">

                                <div className="form-group">
                                    <input type="number" className="form-input" placeholder=" " value={bulkValues.price} onChange={ (e) => pushValue( e, 'price') }></input>
                                    <label className="form-label">price</label>
                                </div>

                                <div className="form-group">
                                    <select className="form-input" value={bulkValues.brand_id} onChange={ (e) => pushValue( e, 'brand') } >
                                        <option value="-1">brand name</option>
                                        { Object.entries(props.listBrands).map( ( [key, row ] : any ) => (
                                            <option key={row.group_id} value={row.group_id}>{row.name}</option>
                                        ))}
                                    </select>
                                    <label className="form-label">brand name</label>
                                </div>

                                <div className="form-group">
                                    <select className="form-input" value={bulkValues.featured_status} onChange={ (e) => pushValue( e, 'featured') } >
                                        <option value="-1">-select-</option>
                                        <option value="0">no</option>
                                        <option value="1">yes</option>
                                    </select>
                                    <label className="form-label">Featured Status</label>
                                </div>

                                <div className="form-group">
                                    <select className="form-input" value={bulkValues.status} onChange={ (e) => pushValue( e, 'status') } >
                                        <option value="-1">-select-</option>
                                        <option value="1">active</option>
                                        <option value="0">inactive</option>
                                    </select>
                                    <label className="form-label">Status</label>
                                </div>

                                <div className="mt-3 columns clm-2">
                                    <button type="button" className="btn-cell--primary" onClick={ (e) => submitUpdate() }>submit</button>
                                    <div className="mt-1 full-width text-right">{props.listCounterChoosen} selected records</div>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
        </div>
    )
}

export default ProductsBulk;