import moment from 'moment';
import React, {useContext} from 'react';
import Button from 'react-bootstrap/Button';
import DeleteButton from '../../../components/DeleteButton';
import InvoicesListContext from './InvoicesListContext';

export default ({invoice}) => {
    const invoiceBadgeVariants = {
        CANCELLED: 'badge-danger',
        PAID: 'badge-success',
        SENT: 'badge-warning'
    };
    const invoicesListContextValue = useContext(InvoicesListContext);

    return (
        <tr>
            <td>{invoice.chrono}</td>
            <td>
                <a href="#">{invoice.customer.firstName} {invoice.customer.lastName} [{invoice.customer.id}]</a>
            </td>
            <td>
                <a href={`mailto:${invoice.customer.email}`}>{invoice.customer.email}</a>
            </td>
            <td>{invoice.customer.company || 'n/a'}</td>
            <td className="text-center">{invoice.amount.toLocaleString()} €</td>
            <td className="text-center">{moment(invoice.sentAt).format('MM/DD/YYYY')}</td>
            <td className="text-center">
                <span className={`badge ${invoiceBadgeVariants[invoice.status]}`}>
                    {invoice.status}
                </span>
            </td>
            <td>
                <Button variant="primary" size="block" aria-label="Edit">
                    Edit
                </Button>
                <DeleteButton
                    disabled={invoice.status !== 'CANCELLED'}
                    handleDelete={() => invoicesListContextValue.handleDelete(invoice.id)}
                />
            </td>
        </tr>
    );
};
