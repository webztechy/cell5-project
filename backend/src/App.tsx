import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
import config from './helpers/Config';

import 'react-confirm-alert/src/react-confirm-alert.css';

import Header from './pages/layout/Header';

import Login from './pages/Login';
import Home from './pages/Home';

import Products from './pages/Products';
import ProductsForm from './pages/ProductsForm';

import Brands from './pages/Brands';
import BrandsForm from './pages/BrandsForm';

import Users from './pages/Users';
import UsersForm from './pages/UsersForm';

import OrdersForm from './pages/OrdersForm';

import { useDispatch, useSelector } from 'react-redux';
import { showNotification, isLoggedin, showCounters  } from './actions';
import Orders from './pages/Orders';

function App() {

  const dispatch = useDispatch();
  const showNotiFooter = useSelector<any>( (state : any ) => state.showNotification );
  const loginStatus = useSelector<any>( (state : any ) => state.isLoggedin );
  const showCounters = useSelector<any>( (state : any ) => state.showCounters );

  const [ pTotal, setPTotal ] = useState<number>(0);
  const [ oTotal, setOTotal ] = useState<number>(0);
  const [ bTotal, setBTotal ] = useState<number>(0);
  const [ uTotal, setUTotal ] = useState<number>(0);

  const [ loginDetail, setLoginDetail ] = useState<any>({});

  const showNotiHtml = () => {
    let msg : any = showNotiFooter;
    if ( showNotiFooter!='' ){

      setTimeout(() => {
        dispatch( showNotification('') );
      }, 3000);

      return ( <div className="alert-noti">
                      <div className="alert-noti--icon"></div>
                      <div className="alert-noti--text">{msg}</div>
                </div> );
    }else{
      return '';
    }
  }


  const getUserLoggin = () => {

    const login_session : any = sessionStorage.getItem('login_session');
    const sessionUserLogin : any = JSON.parse(login_session);

    if ( sessionUserLogin !== null ){
        dispatch( isLoggedin(1) );
        setLoginDetail( sessionUserLogin );
    }
  } 

  const endAccess = () =>{
    dispatch( isLoggedin(0) );
    sessionStorage.removeItem('login_session');
  }


  const getTotal = async ( type : string ) => {
      
      axios
      .post(`${config.api_url}/api/${type}/total` )
      .then( (response : any )=> {
          let result_response : any = response.data;
          if ( parseInt(result_response.status)===1 ){

              if ( type=='products' ){
                  setPTotal(result_response.total);
              }else if ( type=='orders'  ){
                setOTotal(result_response.total);
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
    if (showCounters=='products'){ getTotal('products'); }
    else if (showCounters=='orders'){ getTotal('orders'); }
    else if (showCounters=='brands'){ getTotal('brands'); }
    else if (showCounters=='users'){ getTotal('users'); }
      
  });

  useEffect( () =>{
    getUserLoggin();

    getTotal('products');
    getTotal('orders');
    getTotal('brands');
    getTotal('users');

  }, []);
  
  return (
    <Router>
        <div className="App">
          
          {  (loginStatus===0 ) ? 
                (  <Login /> ) 
                : 
                (
                  <Fragment>

                    <Header  endAccess={endAccess} pTotal={pTotal} bTotal={bTotal} uTotal={uTotal} oTotal={oTotal} />

                    <div className="main-content container">
                        <section className="content">
                            <Switch>
                          
                              <Route path="/" exact component={Home} />
                              <Route path="/home" exact component={Home} />

                              <Route path="/products" exact component={Products} />
                              <Route path="/products-form" exact component={ProductsForm} />
                              <Route path="/products-form/:id" exact component={ProductsForm} />

                              <Route path="/orders" exact component={Orders} />
                              <Route path="/orders-form" exact component={OrdersForm} />
                              <Route path="/orders-form/:id" exact component={OrdersForm} />

                              <Route path="/brands" exact component={Brands} />
                              <Route path="/brands-form" exact component={BrandsForm} />
                              <Route path="/brands-form/:id" exact component={BrandsForm} />

                              <Route path="/users" exact component={Users} />
                              <Route path="/users-form" exact component={UsersForm} />
                              <Route path="/users-form/:id" exact component={UsersForm} />

                            </Switch>
                        </section>
                      </div>
                      
                      
                      <div id="alert-notification" className="alert-notification">
                          { showNotiHtml() }
                      </div>
                  </Fragment>
                )
            }

          <div className="footer">
              <div className="footer-content">
                  Developed by <strong>Renier</strong>. &copy; copyright 2020
              </div>
          </div>
          
          
        </div>
      </Router>
  );
}

export default App;
