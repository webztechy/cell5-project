import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from './../helpers/Config';

const Home = () => {

    const [ pTotal, setPTotal ] = useState<number>(0);
    const [ bTotal, setBTotal ] = useState<number>(0);
    const [ uTotal, setUTotal ] = useState<number>(0);
    const [ loginDetail, setLoginDetail ] = useState<any>({});

    const getTotal = async ( type : string ) => {
    
        axios
        .post(`${config.api_url}/api/${type}/total` )
        .then( (response : any )=> {
            let result_response : any = response.data;
            if ( parseInt(result_response.status)===1 ){

                if ( type=='products' ){
                    setPTotal(result_response.total);
                }else if ( type=='brands'  ){
                    setBTotal(result_response.total);
                }else if ( type=='users'  ){
                    setUTotal(result_response.total);
                }
            }
        })
        .catch( (err : any ) => {
            
        }); 

    }

    
    useEffect( () =>{

        const login_session : any = sessionStorage.getItem('login_session');
        const sessionUserLogin : any = JSON.parse(login_session);

        if ( sessionUserLogin !== null ){
            setLoginDetail( sessionUserLogin );
        }
        
        getTotal('products');
        getTotal('brands');
        getTotal('users');

    }, []);

    return (
        <div className="fade-in">
            
            <h2>Welcome, {loginDetail.first_name} !</h2>
            <ul className="summary-list mt-3">
                <li className="summary-list--box">
                    <div className="summary-list--icon"><i className="fa fa-product-hunt" aria-hidden="true"></i></div>
                    <div>
                        <div className="summary-list--title">products</div>
                        <div className="summary-list--subtitle">{pTotal} records</div>
                    </div>
                </li>
                <li className="summary-list--box">
                     <div className="summary-list--icon"><i className="fa fa-external-link" aria-hidden="true"></i></div>
                    <div>
                        <div className="summary-list--title">brands</div>
                        <div className="summary-list--subtitle">{bTotal} records</div>
                    </div>
                </li>
                <li className="summary-list--box">
                     <div className="summary-list--icon"><i className="fa fa-address-card-o" aria-hidden="true"></i></div>
                    <div>
                        <div className="summary-list--title">users</div>
                        <div className="summary-list--subtitle">{uTotal} records</div>
                    </div>
                </li>
            </ul>

        </div>
    )
}

export default Home;