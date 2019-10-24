import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const DeleteButton = props => {
    const [pendingDelete, setPendingDelete] = useState(false);

    const handleClick = () => {
        setPendingDelete(true);
        props.onClick();
    };

    const getLabel = () => {
        if (!pendingDelete) {
            return 'Delete'
        } else {
            return <Spinner animation="grow" size="sm"/>
        }
    };

    return (
        <Button onClick={() => handleClick()} variant={props.variant} size={props.size} disabled={pendingDelete}>
            {getLabel()}
        </Button>
    );
};

DeleteButton.defaultProps = {
    size: 'block',
    variant: 'danger'
};

export default DeleteButton;
