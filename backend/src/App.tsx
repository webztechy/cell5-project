import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

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


import { useDispatch, useSelector } from 'react-redux';
import { showNotification, isLoggedin  } from './actions';

function App() {

  const dispatch = useDispatch();
  const showNotiFooter = useSelector<any>( (state : any ) => state.showNotification );
  const loginStatus = useSelector<any>( (state : any ) => state.isLoggedin );

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


  useEffect( () =>{
    getUserLoggin();

  }, []);
  
  return (
    <Router>
        <div className="App">
          
          {  (loginStatus===0 ) ? 
                (  <Login /> ) 
                : 
                (
                  <Fragment>

                    <Header  endAccess={endAccess} />

                    <div className="main-content container">
                        <section className="content">
                            <Switch>
                          
                              <Route path="/" exact component={Home} />
                              <Route path="/home" exact component={Home} />

                              <Route path="/products" exact component={Products} />
                              <Route path="/products-form" exact component={ProductsForm} />
                              <Route path="/products-form/:id" exact component={ProductsForm} />

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
