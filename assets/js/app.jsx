import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from 'react-router-dom'
import '../scss/app.scss';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Home from './pages/Home';

const App = () => {
    return (
        <HashRouter>
            <Navbar/>

            <main className="container pt-5">
                <Switch>
            </div>
                    <Route path="/" component={Home}/>
                </Switch>
            </main>
        </HashRouter>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);
