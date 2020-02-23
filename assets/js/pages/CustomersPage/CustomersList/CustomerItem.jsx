import React, {useContext} from 'react';
import DeleteButton from '../../../components/DeleteButton';
import CustomersListContext from './CustomersListContext';

export default ({customer}) => {
    const customersListContextValue = useContext(CustomersListContext);

    return (
        <tr>
            <td>{customer.id}</td>
            <td>
                <a href="#">{customer.firstName + ' ' + customer.lastName}</a>
            </td>
            <td>
                <a href={`mailto:${customer.email}`}>{customer.email}</a>
            </td>
            <td>{customer.company || 'n/a'}</td>
            <td>{customer.invoices.length}</td>
            <td>{customer.unpaidAmount.toLocaleString()} €</td>
            <td>{customer.paidAmount.toLocaleString()} €</td>
            <td>
                <DeleteButton
                    disabled={customer.invoices.length > 0}
                    handleDelete={() => customersListContextValue.handleDelete(customer.id)}
                />
            </td>
        </tr>
    );
};
