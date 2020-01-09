import React, {useContext} from 'react';
import DeleteButton from '../../../components/DeleteButton';
import CustomerListContext from './CustomerListContext';

export default ({customer}) => {
    const customerListContextValue = useContext(CustomerListContext);

    return (
        <tr>
            <td>{customer.id}</td>
            <td>
                <a href="#">{customer.firstName + ' ' + customer.lastName}</a>
            </td>
            <td>{customer.email}</td>
            <td>{customer.company || 'n/a'}</td>
            <td>{customer.invoices.length}</td>
            <td>{customer.unpaidAmount.toLocaleString()} €</td>
            <td>{customer.paidAmount.toLocaleString()} €</td>
            <td>
                <DeleteButton
                    disabled={customer.invoices.length > 0}
                    handleDelete={() => customerListContextValue.handleDelete(customer.id)}
                />
            </td>
        </tr>
    );
};