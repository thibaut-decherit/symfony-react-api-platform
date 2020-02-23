import React, {useEffect, useState} from 'react';
import DropdownButton from '../../../components/DropdownButton';
import Paginator from '../../../components/Paginator';
import SearchBar from '../../../components/SearchBar';
import InvoiceAPIService from '../../../services/APIService/InvoiceAPIService';
import InvoiceItem from './InvoiceItem';
import InvoicesListContext from './InvoicesListContext';

export default () => {
    const [stateCurrentPageNumber, setStateCurrentPageNumber] = useState(1);
    const [stateInvoices, setStateInvoices] = useState([]);
    const [stateInvoicesPerPage, setStateInvoicesPerPage] = useState(5);
    const [stateError, setStateError] = useState(false);
    const [stateIsLoading, setStateIsLoading] = useState(true);
    const [stateSearchValue, setStateSearchValue] = useState('');
    const [stateTotalInvoicesCount, setStateTotalInvoicesCount] = useState(0);

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
        getInvoicesPage();
    }, [stateCurrentPageNumber, stateInvoicesPerPage, stateSearchValue]);

    const getInvoicesPage = () => {
        setStateError(false);
        setStateIsLoading(true);

        InvoiceAPIService.paginatedFindByNameOrCompanyStartsBy(
            stateInvoicesPerPage,
            stateCurrentPageNumber,
            stateSearchValue
        )
            .then(response => {
                setStateInvoices(response.results);
                setStateTotalInvoicesCount(response.totalItemsCount);
            })
            .catch(error => {
                setStateTotalInvoicesCount(0);

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

    const updateInvoicesPerPage = stateInvoicesPerPage => {
        setStateCurrentPageNumber(1);
        setStateInvoicesPerPage(stateInvoicesPerPage);
    };

    const handlePageChange = pageNumber => {
        setStateCurrentPageNumber(pageNumber);
    };

    const handleDelete = invoiceID => {
        return new Promise((resolve, reject) => {
            InvoiceAPIService.deleteOneById(invoiceID)
                .then(() => {
                    /*
                     Will prevent empty page by refreshing the list and triggers a re-rendering of Paginator to
                     update the pagination items if necessary.
                     */
                    getInvoicesPage();

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

    const invoicesListContextValue = {
        handleDelete: handleDelete
    };

    return (
        <InvoicesListContext.Provider value={invoicesListContextValue}>
            <SearchBar onSubmit={handleSearchSubmit} placeholder="Search by first name, last name or company"/>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Nbr.</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th className="text-center">Amount</th>
                        <th className="text-center">Emitted at</th>
                        <th className="text-center">Status</th>
                        <th>
                            <DropdownButton
                                choices={[5, 10, 25]} callback={updateInvoicesPerPage} label={stateInvoicesPerPage}
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
                    If stateInvoices.length === 0 && stateTotalInvoicesCount !== 0 it means that the API has results
                    but getInvoicesPage() has not had the time to update stateInvoices yet, so we assume the data is
                    still loading.
                     */}
                    {(stateIsLoading || stateInvoices.length === 0) && stateTotalInvoicesCount !== 0 && (
                        <tr>
                            <td>Loading...</td>
                        </tr>
                    )}
                    {!stateIsLoading && !stateError && stateTotalInvoicesCount === 0 && stateSearchValue !== '' && (
                        <tr>
                            <td>No results for "{stateSearchValue}"</td>
                        </tr>
                    )}
                    {!stateIsLoading && !stateError && stateTotalInvoicesCount === 0 && stateSearchValue === '' && (
                        <tr>
                            <td>No results</td>
                        </tr>
                    )}
                    {!stateIsLoading && stateInvoices.map(invoice => {
                        return (
                            <InvoiceItem
                                key={invoice.id} invoice={invoice}
                            />
                        );
                    })}
                </tbody>
            </table>
            <Paginator
                itemsPerPage={stateInvoicesPerPage} totalItemsCount={stateTotalInvoicesCount}
                currentPageNumber={stateCurrentPageNumber} setCurrentPageNumber={handlePageChange}
            />
        </InvoicesListContext.Provider>
    );
};
