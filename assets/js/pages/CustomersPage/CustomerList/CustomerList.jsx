import React, {useEffect, useState} from 'react';
import DropdownButton from '../../../components/DropdownButton';
import Paginator from '../../../components/Paginator';
import SearchBar from '../../../components/SearchBar';
import CustomerAPIService from '../../../services/APIService/CustomerAPIService';
import CustomerItem from './CustomerItem';
import CustomerListContext from './CustomerListContext';

export default () => {
    const [stateCurrentPageNumber, setStateCurrentPageNumber] = useState(1);
    const [stateCustomers, setStateCustomers] = useState([]);
    const [stateCustomersPerPage, setStateCustomersPerPage] = useState(5);
    const [stateError, setStateError] = useState(false);
    const [stateIsLoading, setStateIsLoading] = useState(true);
    const [stateSearchValue, setStateSearchValue] = useState('');
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
    }, [stateCurrentPageNumber, stateCustomersPerPage, stateSearchValue]);

    const getCustomerPage = () => {
        setStateError(false);
        setStateIsLoading(true);

        CustomerAPIService.paginatedFindByNameOrCompanyStartsBy(
            stateCustomersPerPage,
            stateCurrentPageNumber,
            stateSearchValue
        )
            .then(response => {
                setStateCustomers(response.results);
                setStateTotalCustomersCount(response.totalItemsCount);
            })
            .catch(error => {
                setStateTotalCustomersCount(0);

                if (error.message === 'Network Error') {
                    setStateError('Network error');
                } else {
                    setStateError('Something went wrong');
                }
            })
            .finally(() => {
                setStateIsLoading(false);
            })
    };

    const updateCustomersPerPage = stateCustomersPerPage => {
        setStateCurrentPageNumber(1);
        setStateCustomersPerPage(stateCustomersPerPage);
    };

    const handlePageChange = pageNumber => {
        setStateCurrentPageNumber(pageNumber);
    };

    const handleDelete = customerID => {
        return new Promise((resolve, reject) => {
            CustomerAPIService.deleteOneById(customerID)
                .then(() => {
                    /*
                     Will prevent empty page by refreshing the list and triggers a re-rendering of Paginator to
                     update the pagination items if necessary.
                     */
                    getCustomerPage();

                    resolve();
                })
                .catch(() => {
                    reject();
                })
        })
    };

    const handleSearchSubmit = searchValue => {
        setStateSearchValue(searchValue);
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
                    {stateError && (
                        <tr>
                            <td>{stateError}</td>
                        </tr>
                    )}
                    {/*
                    If stateCustomers.length === 0 && stateTotalCustomersCount !== 0 it means that the API has results
                    but getCustomerPage() has not had the time to update stateCustomers yet, so we assume the data is
                    still loading.
                     */}
                    {(stateIsLoading || stateCustomers.length === 0) && stateTotalCustomersCount !== 0 && (
                        <tr>
                            <td>Loading...</td>
                        </tr>
                    )}
                    {!stateIsLoading && !stateError && stateTotalCustomersCount === 0 && stateSearchValue !== '' && (
                        <tr>
                            <td>No results for "{stateSearchValue}"</td>
                        </tr>
                    )}
                    {!stateIsLoading && !stateError && stateTotalCustomersCount === 0 && stateSearchValue === '' && (
                        <tr>
                            <td>No results</td>
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
