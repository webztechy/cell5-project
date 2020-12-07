import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import 'react-confirm-alert/src/react-confirm-alert.css';

import Header from './pages/layout/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductsForm from './pages/ProductsForm';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification  } from './actions';

function App() {

  const dispatch = useDispatch();
  const showNotiFooter = useSelector<any>( (state : any ) => state.showNotification );
  
  const showNotiHtml = () => {
    let msg : any = showNotiFooter;
    if ( showNotiFooter!='' ){

      setTimeout(() => {
        dispatch( showNotification('') );
      }, 2000);

      return ( <div className="alert-noti">
                      <div className="alert-noti--icon"></div>
                      <div className="alert-noti--text">{msg}</div>
                </div> );
    }else{
      return '';
    }
  }

  
  return (
    <Router>
        <div className="App">
          <Header />

          <div className="main-content container">
              <section className="content">
                  <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/home" exact component={Home} />
                    <Route path="/products" exact component={Products} />
                    <Route path="/products-form" exact component={ProductsForm} />
                    <Route path="/products-form/:id" exact component={ProductsForm} />

                  </Switch>
              </section>
            </div>
            
            <div className="footer">
                <div className="footer-content">
                    Developed by <strong>Renier</strong>. &copy; copyright 2020
                </div>
            </div>
            
            <div id="alert-notification" className="alert-notification">
                { showNotiHtml() }
            </div>

        </div>
      </Router>
  );
}

export default App;
