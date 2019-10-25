import axios from 'axios';
import React, {useEffect, useState} from 'react';
import DropdownButton from '../../DropdownButton';
import CustomerItem from './CustomerItem';
import CustomerListContext from './CustomerListContext';
import CustomerListPagination from './CustomerListPagination';

export default props => {
    const [customers, setCustomers] = useState([]);
    const [customersPerPage, setCustomersPerPage] = useState(5);
    const [totalCustomersCount, setTotalCustomersCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);

    /*
     useEffect hook is called on render.
     If optional second parameter is:
        - not specified, the hook is called on each render
        - an empty array, the hook is called only on the first render of the component
        - an array containing one or multiple variables (most proably states), the hook is called on render if one of
        the values has changed since previous render
     See https://reactjs.org/docs/hooks-effect.html
     */
    useEffect(() => {
        getCustomerPage(pageNumber);
    }, [pageNumber, customersPerPage]);

    const getCustomerPage = pageNumber => {
        axios
            .get(`https://localhost:8000/api/customers?pagination=true&itemsPerPage=${customersPerPage}&page=${pageNumber}`)
            .then(response => {
                setCustomers(response.data['hydra:member']);
                setTotalCustomersCount(response.data['hydra:totalItems']);
            })
            .catch(error => {
                console.log(error)
            })
    };

    const updateCustomersPerPage = customersPerPage => {
        setPageNumber(1);
        setCustomersPerPage(customersPerPage);
    };

    const handleDelete = customerID => {
        return new Promise((resolve, reject) => {
            axios
                .delete('https://localhost:8000/api/customers/' + customerID)
                .then(response => {
                    if (response.status < 300) {
                        setCustomers(customers.filter(customer => customer.id !== customerID));
                        resolve();
                    } else {
                        console.error(
                            `Server responded with status code ${response.status}`
                        );
                        reject();
                    }
                })
                .catch(error => {
                    console.error(error.message);
                    reject();
                })
        })
    };

    const customerListContextValue = {
        handleDelete: handleDelete
    };

    return (
        <CustomerListContext.Provider value={customerListContextValue}>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th>Invoices</th>
                        <th>Unpaid</th>
                        <th>Paid</th>
                        <th>
                            <DropdownButton
                                choices={[5, 10, 25]} callback={updateCustomersPerPage} label={customersPerPage}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => {
                        return (
                            <CustomerItem
                                key={customer.id} customer={customer}
                            />
                        );
                    })}
                </tbody>
            </table>
            <CustomerListPagination
                settings={{customersPerPage, totalCustomersCount}} currentPageNumber={pageNumber}
                setPageNumber={setPageNumber}
            />
        </CustomerListContext.Provider>
    );
};
