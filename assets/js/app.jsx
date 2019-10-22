import '../scss/app.scss';

import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    return <h1>Hello world!</h1>;
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);
