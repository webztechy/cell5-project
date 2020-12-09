import React from 'react';
import { Link } from 'react-router-dom';

export interface Props {
    endAccess : any;
    pTotal : number;
    oTotal : number;
    bTotal : number;
    uTotal : number
} 

const Header : React.FC<Props>  = ( props ) => {
    
    return (
        <div className="top-header">
            <div className="container">
                <div className="top-header__content">
                    <div className="site-logo"><Link className="site-logo--item"to="/home">Cell5</Link></div>
                    <ul className="main-nav">
                        <li className="main-nav--item"><Link className="main-nav--item__link" to="/home">Home</Link></li>
                        <li className="main-nav--item">
                            <Link className="main-nav--item__link"to="/products">Products <span className="nav-counter">{props.pTotal}</span></Link>
                            <ul className="main-nav--sub">
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/products">View List</Link></li>
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/products-form">Add Product</Link></li>
                            </ul>
                        </li>
                        <li className="main-nav--item">
                            <Link className="main-nav--item__link"to="/orders">Order <span className="nav-counter">{props.oTotal}</span></Link>
                            <ul className="main-nav--sub">
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/orders">View List</Link></li>
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/orders-form">Add Order</Link></li>
                            </ul>
                        </li>
                        <li className="main-nav--item">
                            <Link className="main-nav--item__link"to="/brands">Brands <span className="nav-counter">{props.bTotal}</span></Link>
                            <ul className="main-nav--sub">
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/brands">View List</Link></li>
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/brands-form">Add Brand</Link></li>
                            </ul>
                        </li>
                        <li className="main-nav--item">
                            <Link className="main-nav--item__link"to="/users">Users <span className="nav-counter">{props.uTotal}</span></Link>
                            <ul className="main-nav--sub">
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/users">View List</Link></li>
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/users-form">Add User</Link></li>
                            </ul>
                        </li>
                    </ul>

                    <ul className="user-nav">
                        <li className="user-nav--item"><Link className="user-nav--item__link" to="/" onClick={ (e) => props.endAccess() }><i className="fa fa-cog"></i> Logout</Link></li>
                    </ul>

                </div>
            </div>
        </div>
    )
}

export default Header;