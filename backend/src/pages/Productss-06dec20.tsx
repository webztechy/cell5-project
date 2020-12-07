import React from 'react';

const Products = () => {
    return (
        <div className="fade-in">

            <ul className="ul-table--filter">
                <li>Product List</li>
                <li className="ul-table--filter--option">
                    filter by
                    <select className="cell-input">
                        <option value="-1">brand name</option>
                        <option value="1">2</option>
                        <option value="1">3</option>
                    </select>
                    <select className="cell-input">
                        <option value="-1">status</option>
                        <option value="1">yes</option>
                        <option value="0">no</option>
                    </select>
                    <select className="cell-input">
                        <option value="-1">featured</option>
                        <option value="1">yes</option>
                        <option value="0">no</option>
                    </select>
                    <input type="text" className="cell-input" placeholder="type name here.."></input>

                    <button type="button" className="btn-cell--primary">submit</button>
                </li>
            </ul>

            <ul className="ul-table ul-table--head ul-table--products">
                <li className="ul-table--tr">
                    <div>col1</div>
                    <div className="sort-asc">col1</div>
                    <div className="sort-desc">col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                </li>
            </ul>


            <ul className="ul-table ul-table--body ul-table--products">
                <li className="ul-table--tr">
                    <div><input type="checkbox" className="cell-checkbox"></input></div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                </li>
                <li className="ul-table--tr">
                    <div><input type="checkbox" className="cell-checkbox"></input></div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                </li>
                <li className="ul-table--tr">
                    <div><input type="checkbox" className="cell-checkbox"></input></div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                </li>
                <li className="ul-table--tr">
                   <div><input type="checkbox" className="cell-checkbox"></input></div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                    <div>col1</div>
                </li>
            </ul>

            <ul className="ul-table ul-table--footer">
                <li className="ul-table--tr">

                    <div className="ul-table--footer__actions">
                        bulk action
                        <select className="cell-input">
                            <option value="0">---</option>
                            <option value="1">delete</option>
                        </select>
                    </div>

                    <div className="ul-table--footer__limit">
                        per page
                        <select className="cell-input">
                            <option value="1">1</option>
                            <option value="1">2</option>
                            <option value="1">3</option>
                        </select>
                    </div>
                    <div className="ul-table--footer__pager">
                        page
                        <select  className="cell-input">
                            <option value="1">1</option>
                            <option value="1">2</option>
                            <option value="1">3</option>
                        </select>
                    </div>
                    <div className="ul-table--footer__page-info">1 / 12 pages</div>
                </li>
            </ul>

        </div>
    )
}

export default Products;