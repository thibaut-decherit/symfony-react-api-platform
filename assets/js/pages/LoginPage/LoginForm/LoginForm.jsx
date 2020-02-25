import React, {useState} from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AuthenticationService from '../../../services/AuthenticationService'

export default () => {
    const initialStateCredentials = {
        username: '',
        password: ''
    };
    const [stateCredentials, setStateCredentials] = useState(initialStateCredentials);
    const initialStateGlobalFormErrorMessage = '';
    const [stateGlobalFormErrorMessage, setStateGlobalFormErrorMessage] = useState(initialStateGlobalFormErrorMessage);

    const handleChange = event => {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;

        setStateCredentials({...stateCredentials, [name]: value});
    };

    const handleSubmit = async event => {
        event.preventDefault();

        setStateGlobalFormErrorMessage(initialStateGlobalFormErrorMessage);

        let loginResponse;
        try {
            loginResponse = await AuthenticationService.login(stateCredentials);
        } catch (error) {
            loginResponse = error;
        }

        switch (loginResponse) {
            case 'success':
                // TODO: handle success
                break;
            case 'bad credentials':
                setStateGlobalFormErrorMessage('Wrong email or password');
                break;
            case 'network error':
                setStateGlobalFormErrorMessage('Network Error');
                break;
            default:
                setStateGlobalFormErrorMessage('Something went wrong');
        }
    };

    return (
        <>
            {stateGlobalFormErrorMessage !== initialStateGlobalFormErrorMessage && (
                <Alert variant="danger" className="text-center">
                    {stateGlobalFormErrorMessage}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email-field">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control required type="email" name="username" value={stateCredentials.username}
                                  onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="password-field">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" name="password" value={stateCredentials.password}
                                  onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </>
    );
};
