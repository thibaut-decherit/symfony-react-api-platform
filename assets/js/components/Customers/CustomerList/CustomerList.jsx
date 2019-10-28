import axios from 'axios';
import React, {useEffect, useState} from 'react';
import DropdownButton from '../../reusable/DropdownButton';
import Paginator from '../../reusable/Paginator';
import CustomerItem from './CustomerItem';
import CustomerListContext from './CustomerListContext';

export default () => {
    const [stateCustomers, setStateCustomers] = useState([]);
    const [stateCustomersPerPage, setStateCustomersPerPage] = useState(5);
    const [stateCurrentPageNumber, setStateCurrentPageNumber] = useState(1);
    const [stateTotalCustomersCount, setStateTotalCustomersCount] = useState(0);

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
        getCustomerPage(stateCurrentPageNumber);
    }, [stateCurrentPageNumber, stateCustomersPerPage]);

    const getCustomerPage = stateCurrentPageNumber => {
        axios
            .get(`https://localhost:8000/api/customers?pagination=true&itemsPerPage=${stateCustomersPerPage}&page=${stateCurrentPageNumber}`)
            .then(response => {
                setStateCustomers(response.data['hydra:member']);
                setStateTotalCustomersCount(response.data['hydra:totalItems']);
            })
            .catch(error => {
                console.log(error)
            })
    };

    const updateCustomersPerPage = stateCustomersPerPage => {
        setStateCurrentPageNumber(1);
        setStateCustomersPerPage(stateCustomersPerPage);
    };

    const handleDelete = customerID => {
        return new Promise((resolve, reject) => {
            axios
                .delete('https://localhost:8000/api/customers/' + customerID)
                .then(response => {
                    if (response.status < 300) {
                        setStateCustomers(stateCustomers.filter(customer => customer.id !== customerID));
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
                                choices={[5, 10, 25]} callback={updateCustomersPerPage} label={stateCustomersPerPage}
                                size="block"
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {stateCustomers.map(customer => {
                        return (
                            <CustomerItem
                                key={customer.id} customer={customer}
                            />
                        );
                    })}
                </tbody>
            </table>
            <Paginator
                itemsPerPage={stateCustomersPerPage} totalItemsCount={stateTotalCustomersCount}
                currentPageNumber={stateCurrentPageNumber} setCurrentPageNumber={setStateCurrentPageNumber}
            />
        </CustomerListContext.Provider>
    );
};
