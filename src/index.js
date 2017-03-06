require('./pusher.min.js');
//From https://js.pusher.com/3.2/pusher.min.js
require('./grid.css');
require('./index.css');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App/App');

ReactDOM.render(<App />, document.getElementById('app'));