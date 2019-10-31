import axios from 'axios';
import React, {useEffect, useState} from 'react';
import DropdownButton from '../../reusable/DropdownButton';
import Paginator from '../../reusable/Paginator';
import SearchBar from '../../reusable/SearchBar';
import CustomerItem from './CustomerItem';
import CustomerListContext from './CustomerListContext';

export default () => {
    const [stateCustomers, setStateCustomers] = useState([]);
    const [stateCustomersPerPage, setStateCustomersPerPage] = useState(5);
    const [stateCurrentPageNumber, setStateCurrentPageNumber] = useState(1);
    const [stateIsLoading, setStateIsLoading] = useState(true);
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
        getCustomerPage();
    }, [stateCurrentPageNumber, stateCustomersPerPage]);

    const getCustomerPage = (searchValue = '') => {
        axios
            .get(`https://localhost:8000/api/customers?pagination=true&itemsPerPage=${stateCustomersPerPage}&page=${stateCurrentPageNumber}&nameOrCompanyStartsBy=${searchValue}`)
            .then(response => {
                setStateCustomers(response.data['hydra:member']);
                setStateTotalCustomersCount(response.data['hydra:totalItems']);
                setStateIsLoading(false);
            })
            .catch(error => {
                console.log(error)
            })
    };

    const updateCustomersPerPage = stateCustomersPerPage => {
        setStateCurrentPageNumber(1);
        setStateCustomersPerPage(stateCustomersPerPage);
    };

    const handlePageChange = pageNumber => {
        setStateIsLoading(true);
        setStateCurrentPageNumber(pageNumber);
    };

    const handleDelete = customerID => {
        return new Promise((resolve, reject) => {
            axios
                .delete('https://localhost:8000/api/customers/' + customerID)
                .then(response => {
                    if (response.status < 300) {
                        /*
                         Will prevent empty page by refreshing the list and triggers a re-rendering of Paginator to
                         update the pagination items if necessary.
                         */
                        getCustomerPage();

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

    const handleSearchSubmit = searchValue => {
        setStateIsLoading(true);
        getCustomerPage(searchValue);
    };

    const customerListContextValue = {
        handleDelete: handleDelete
    };

    return (
        <CustomerListContext.Provider value={customerListContextValue}>
            <SearchBar onSubmit={handleSearchSubmit} placeholder="Search by first name, last name or company"/>
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
                    {stateIsLoading && (
                        <tr>
                            <td>Loading</td>
                        </tr>
                    )}
                    {!stateIsLoading && stateCustomers.length === 0 && (
                        <tr>
                            <td>No result</td>
                        </tr>
                    )}
                    {!stateIsLoading && stateCustomers.map(customer => {
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
                currentPageNumber={stateCurrentPageNumber} setCurrentPageNumber={handlePageChange}
            />
        </CustomerListContext.Provider>
    );
};
