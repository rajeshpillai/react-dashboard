import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import Layout from './layout';
import AppCollection from './containers/app-collection';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AppCollection />, document.getElementById('root'));
registerServiceWorker();
