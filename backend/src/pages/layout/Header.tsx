import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="top-header">
            <div className="container">
                <div className="top-header__content">
                    <div className="site-logo"><Link className="site-logo--item"to="/home">Cell5</Link></div>
                    <ul className="main-nav">
                        <li className="main-nav--item"><Link className="main-nav--item__link" to="/home">Home</Link></li>
                        <li className="main-nav--item">
                            <Link className="main-nav--item__link"to="/products">Products</Link>
                            <ul className="main-nav--sub">
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/products">View List</Link></li>
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/products-form">Add Product</Link></li>
                            </ul>
                        </li>
                        <li className="main-nav--item">
                            <Link className="main-nav--item__link"to="/">Brands</Link>
                            <ul className="main-nav--sub">
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/">View List</Link></li>
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/">Add Brand</Link></li>
                            </ul>
                        </li>
                        <li className="main-nav--item">
                            <Link className="main-nav--item__link"to="/">Users</Link>
                            <ul className="main-nav--sub">
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/">View List</Link></li>
                                <li className="main-nav--sub--item"><Link className="main-nav--sub--item__link" to="/">Add User</Link></li>
                            </ul>
                        </li>
                    </ul>

                    <ul className="user-nav">
                        <li className="user-nav--item"><Link className="user-nav--item__link" to="/"><i className="fa fa-cog"></i> Logout</Link></li>
                    </ul>

                </div>
            </div>
        </div>
    )
}

export default Header;