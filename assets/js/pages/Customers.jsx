import React from 'react';

export default (props) => {
    return (
        <>
            <h1>Clients</h1>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Invoices</th>
                    <th>Total amount</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="">18</td>
                    <td>
                        <a href="#">Thibaut Decherit</a>
                    </td>
                    <td>thibaut@symreact.com</td>
                    <td>SymReact Inc.</td>
                    <td>4</td>
                    <td>2400€</td>
                    <td>
                        <button className="btn btn-sm btn-danger">Delete</button>
                    </td>
                </tr>
                <tr>
                    <td className="">18</td>
                    <td>
                        <a href="#">Thibaut Decherit</a>
                    </td>
                    <td>thibaut@symreact.com</td>
                    <td>SymReact Inc.</td>
                    <td>4</td>
                    <td>2400€</td>
                    <td>
                        <button className="btn btn-sm btn-danger">Delete</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </>
    );
};
