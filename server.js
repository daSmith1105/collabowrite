var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var api = require('./api');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'build')));
app.use('/api', api);

mongoose.connect('mongodb://admin:password@ds137149.mlab.com:37149/collabowrite');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function () {
  app.listen(process.env.PORT, process.env.IP, function () {
    console.log('Node server running on port ' + process.env.PORT);
  });
});