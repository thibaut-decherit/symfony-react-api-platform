import React from 'react';

const Navbar = (props) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">SymReact</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02"
                    aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor02">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="#">Clients</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Invoices</a>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto d-flex">
                    <li>
                        <button className="btn btn-primary">
                            Register
                        </button>
                    </li>
                    <li>
                        <button className="btn btn-secondary">
                            Login
                        </button>
                    </li>
                    <li>
                        <button className="btn btn-secondary">
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
