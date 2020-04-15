const express = require('express')
const app = express()
const port = 9009
const apiV1 = require('./App/v1');

const uuid = require('uuid');
const crypto = require("crypto");

require('./App/configs/constants');
require('./App/configs/connection');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({    
  extended: true
}));   

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    next();
});
app.use('/api/v1', apiV1);

app.listen(process.env.PORT || port, () => console.log(`Bookmark sevices listening on port ${port}!`))