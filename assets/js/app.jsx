import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/app.scss';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';

const App = () => {
    return (
        <>
            <Navbar/>

            <div className="container pt-5">
                <Homepage/>
            </div>
        </>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);
