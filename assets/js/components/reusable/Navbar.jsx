import React from 'react';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default (props) => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#">SymReact</Navbar.Brand>
            <Navbar.Toggle aria-controls="collapsible-nav"/>

            <Navbar.Collapse id="collapsible-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#customers">Clients</Nav.Link>
                    <Nav.Link href="#invoices">Invoices</Nav.Link>
                </Nav>
                <div className="ml-auto d-flex">
                    <Button variant="primary">
                        Register
                    </Button>
                    <Button variant="secondary">
                        Login
                    </Button>
                    <Button variant="secondary">
                        Logout
                    </Button>
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
};
