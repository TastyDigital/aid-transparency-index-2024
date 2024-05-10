import React from 'react';
//import ReactDOM from 'react-dom';
const ReactDOM = wp.element;
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './App';

//const target = document.getElementById('ati-root');
const targets = document.querySelectorAll('.ati-root');
const defaultSettings = {
    'display': 'graph', // 'graph', // 'barchart', // 'table'
    'color': '#0000ff',
    'theme': '2020',
    'name': 'World',
    'height':480,
    'width':1080,
    'agency':'Korea, KOICA'
};

Array.prototype.forEach.call(targets, target => {
    const id = target.dataset.id;
    const settings = (!! id) ? window.atiSettings[id] : defaultSettings;
    ReactDOM.render(
        <React.StrictMode>
            <App settings={settings} key={id} />
        </React.StrictMode>,
        target
    );
});
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.

serviceWorker.unregister();

