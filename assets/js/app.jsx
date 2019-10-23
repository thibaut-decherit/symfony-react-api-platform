import React from 'react';
import Container from 'react-bootstrap/Container';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from 'react-router-dom';
import '../scss/app.scss';
import Navbar from './components/Navbar';
import Home from './pages/Home';

const App = () => {
    return (
        <HashRouter>
            <Navbar/>

            <Container className="pt-5">
                <Switch>
            </div>
                    <Route path="/" component={Home}/>
                </Switch>
            </Container>
        </HashRouter>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);
