import React, { useEffect, useState } from 'react';

export interface Props {
    closeBulkPopUp : any,
    listBrands : any,
    updateListBulk: any;
    popupClass : string
} 
const ProductsBulk : React.FC<Props>  = ( props ) => {

    /* const [ classPopup, setClassPopup ] = useState<string>(props.popupClass);

    const _closeModal = () => {
        setClassPopup('');
    }

    useEffect( () =>{
        setClassPopup(props.popupClass);
    }, [props]) */;

    return (
        <div className="modal-cell-wrap">

                <div className={ 'modal-cell show- ' + props.popupClass }>
                    <div className="modal-cell--content">
                        <div className="modal-cell--content__head">
                            Bulk Action
                            <div className="btn-modal-close" onClick={ () => props.closeBulkPopUp() }>x</div>
                        </div>
                        <div className="modal-cell--content__body">
                            
                            <form action="" className="form-cell">

                                <div className="form-group">
                                    <input type="text" className="form-input" placeholder=" "></input>
                                    <label className="form-label">price</label>
                                </div>

                                <div className="form-group">
                                    <select className="form-input">
                                    <option value="-1">brand name</option>
                                    { Object.entries(props.listBrands).map( ( [key, row ] : any ) => (
                                        <option key={row.group_id} value={row.group_id}>{row.name}</option>
                                    ))}
                                    </select>
                                    <label className="form-label">brand name</label>
                                </div>

                                <div className="form-group">
                                    <select className="form-input">
                                        <option value="-1">-select-</option>
                                        <option value="0">no</option>
                                        <option value="1">yes</option>
                                    </select>
                                    <label className="form-label">Featured Status</label>
                                </div>

                                <div className="form-group">
                                    <select className="form-input">
                                        <option value="-1">-select-</option>
                                        <option value="0">active</option>
                                        <option value="1">inactive</option>
                                    </select>
                                    <label className="form-label">Status</label>
                                </div>

                                <div className="mt-3">
                                    <button type="button" className="btn-cell--primary">submit</button>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
        </div>
    )
}

export default ProductsBulk;