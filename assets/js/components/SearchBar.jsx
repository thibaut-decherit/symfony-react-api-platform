import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

const SearchBar = ({buttonLabel, buttonPosition, buttonVariant, onSubmit, placeholder}) => {
    const [stateSearchInput, setStateSearchInput] = useState('');

    const handleSearchInput = event => {
        setStateSearchInput(event.currentTarget.value);
    };

    return (
        <Form onSubmit={() => onSubmit(stateSearchInput)}>
            <InputGroup className="mb-3">
                {buttonPosition === 'prepend' && (
                    <InputGroup.Prepend>
                        <Button type="submit" variant={buttonVariant}>{buttonLabel}</Button>
                    </InputGroup.Prepend>
                )}
                <FormControl placeholder={placeholder} aria-label={placeholder} onChange={handleSearchInput}/>
                {buttonPosition === 'append' && (
                    <InputGroup.Append>
                        <Button type="submit" variant={buttonVariant}>{buttonLabel}</Button>
                    </InputGroup.Append>
                )}
            </InputGroup>
        </Form>
    );
};

SearchBar.defaultProps = {
    buttonLabel: 'Search',
    buttonPosition: 'append',
    buttonVariant: 'primary'
};

export default SearchBar;
