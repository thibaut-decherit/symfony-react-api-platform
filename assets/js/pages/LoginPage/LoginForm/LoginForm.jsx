import React, {useState} from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import LodashHelper from '../../../helpers/LodashHelper';
import AuthenticationService from '../../../services/AuthenticationService';

export default () => {
    const initialStateCredentials = {
        username: '',
        password: ''
    };
    const [stateCredentials, setStateCredentials] = useState(initialStateCredentials);
    const initialStateGlobalFormAlert = {};
    const [stateGlobalFormAlert, setStateGlobalFormAlert] = useState(initialStateGlobalFormAlert);

    const handleChange = event => {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;

        setStateCredentials({...stateCredentials, [name]: value});
    };

    const handleSubmit = async event => {
        event.preventDefault();

        setStateGlobalFormAlert(initialStateGlobalFormAlert);

        let loginResponse;
        try {
            loginResponse = await AuthenticationService.login(stateCredentials);
        } catch (error) {
            loginResponse = error;
        }

        switch (loginResponse) {
            case 'success':
                setStateGlobalFormAlert({variant: 'success', message: 'Welcome'});
                break;
            case 'bad credentials':
                setStateGlobalFormAlert({variant: 'danger', message: 'Wrong email or password'});
                break;
            case 'network error':
                setStateGlobalFormAlert({variant: 'danger', message: 'Network Error'});
                break;
            default:
                setStateGlobalFormAlert({variant: 'danger', message: 'Something went wrong'});
        }

        setStateCredentials({...stateCredentials, password: ''});
    };

    return (
        <>
            {LodashHelper.hasAll(stateGlobalFormAlert, ['variant', 'message']) && (
                <Alert variant={stateGlobalFormAlert.variant} className="text-center">
                    {stateGlobalFormAlert.message}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email-field">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        required type="email" name="username" value={stateCredentials.username} onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="password-field">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required type="password" name="password" value={stateCredentials.password}
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
