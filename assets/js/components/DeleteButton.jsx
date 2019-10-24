import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const DeleteButton = props => {
    const [pendingDelete, setPendingDelete] = useState(false);
    const [pendingConfirmation, setPendingConfirmation] = useState(false);

    const deleteButton = () => {
        const getLabel = () => {
            if (pendingDelete) {
                return (
                    <Spinner animation="border" size="sm"/>
                );
            }

            return 'Delete';
        };

        const showConfirmationButtons = () => {
            setPendingConfirmation(true);
        };

        return (
            <Button onClick={() => showConfirmationButtons()} variant={props.variant} size={props.size}
                    disabled={pendingDelete}
            >
                {getLabel()}
            </Button>
        );
    };

    const confirmationButtons = () => {
        const handleDeleteButtonClick = () => {
            setPendingDelete(true);
            setPendingConfirmation(false);

            // Button goes back to initial state if delete request fails.
            props.onClick()
                .catch(() => {
                    setPendingDelete(false);
                });
        };

        const handleCancelButtonClick = () => {
            setPendingConfirmation(false);
        };

        return (
            <div>
                <Button
                    onClick={() => handleDeleteButtonClick()} variant="success" className="w-50"
                    aria-label="Confirm deletion"
                >
                    Y
                </Button>
                <Button
                    onClick={() => handleCancelButtonClick()} variant="danger" className="w-50"
                    aria-label="Cancel deletion"
                >
                    N
                </Button>
            </div>
        );
    };

    if (pendingConfirmation) {
        return confirmationButtons();
    }

    return deleteButton();
};

DeleteButton.defaultProps = {
    size: 'block',
    variant: 'danger'
};

export default DeleteButton;
