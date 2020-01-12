import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const DeleteButton = ({handleDelete, variant, size, disabled}) => {
    const [confirmationButtonsInteractive, setConfirmationButtonsInteractive] = useState(false);
    const [pendingConfirmation, setPendingConfirmation] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(false);

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

            setTimeout(() => {
                setConfirmationButtonsInteractive(true);
            }, 250)
        };

        return (
            <Button onClick={() => showConfirmationButtons()} variant={variant} size={size}
                    disabled={pendingDelete || disabled}
            >
                {getLabel()}
            </Button>
        );
    };

    const confirmationButtons = () => {
        const handleDeleteButtonClick = () => {
            if (!confirmationButtonsInteractive) {
                return;
            } else {
                setConfirmationButtonsInteractive(false);
            }

            setPendingDelete(true);
            setPendingConfirmation(false);

            // Button goes back to initial state if delete request fails.
            handleDelete()
                .catch(() => {
                    setPendingDelete(false);
                });
        };

        const handleCancelButtonClick = () => {
            if (!confirmationButtonsInteractive) {
                return;
            } else {
                setConfirmationButtonsInteractive(false);
            }

            setPendingConfirmation(false);
        };

        return (
            <div className="delete-button-confirmation-buttons-group">
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
    disabled: false,
    size: 'block',
    variant: 'danger'
};

export default DeleteButton;
