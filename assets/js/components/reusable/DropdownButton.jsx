import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const DropdownButton = ({callback, choices, id, label, size, variant}) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant={variant} size={size} id={id}>{label}</Dropdown.Toggle>

            <Dropdown.Menu>
                {choices.map(choice => {
                    return (
                        <Dropdown.Item key={choice} onClick={() => callback(choice)}>{choice}</Dropdown.Item>
                    );
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default DropdownButton;

DropdownButton.defaultProps = {
    callback: () => {
        console.error(
            'DropdownButton callback is not defined. You must pass a function that will be called when a choice is clicked and receives the clicked choice as parameter'
        );
    },
    choices: [
        'Choice 1',
        'Choice 2',
        'Choice 3'
    ],
    id: 'dropdown-basic',
    label: 'Button',
    size: 'sm',
    variant: 'primary'
};
