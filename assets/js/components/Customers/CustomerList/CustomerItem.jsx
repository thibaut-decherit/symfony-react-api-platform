import React, {useContext} from 'react';
import DeleteButton from '../../DeleteButton';
import CustomerListContext from './CustomerListContext';

export default props => {
    const customer = props.customer;

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
                    handleDelete={() => customerListContextValue.handleDelete(customer.id)}
                />
            </td>
        </tr>
    );
};
