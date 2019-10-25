import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export default props => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="primary" size="block" id="dropdown-basic">{props.label}</Dropdown.Toggle>

            <Dropdown.Menu>
                {props.choices.map(choice => {
                    return (
                        <Dropdown.Item key={choice} onClick={() => props.callback(choice)}>{choice}</Dropdown.Item>
                    );
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
};
