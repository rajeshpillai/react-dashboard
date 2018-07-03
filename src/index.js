import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppCollection from './AppCollection';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AppCollection />, document.getElementById('root'));
registerServiceWorker();
