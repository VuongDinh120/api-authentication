const express = require('express');

const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
require('express-async-errors');
require('dotenv').config();

const basicAuth = require("./middlewares/auth.mdw");

const app = express();

app.use(cors());
//write log api
// app.use(morgan('common', {stream: fs.createWriteStream('./logs/access.log', {flags: 'a'})}))
app.use(morgan('dev'));
app.use(express.json());


// use basic HTTP auth to secure the api
// app.use(basicAuth);

// api routes
app.get('/', function (req, res) {
    res.json({
        message: "Hello, I'm Sakila!!"
    });
})
app.use('/api/auth', require('./routers/auth.route'));
app.use('/api/films', require('./routers/film.route'));
app.use('/api/accounts', require('./routers/account.route'));

// global error handler
app.get('/err', function (req, res) {
    throw new Error('BROKEN!');
})

app.use(function (req, res, next) {
    res.status(404).json({
        error_message: 'End-point not found!'
    });
})

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
        error_message: 'Server has been broken!!!'
    });
})
// start server
const PORT = 3000;
app.listen(PORT, function () {
    console.log(`server is running at http://localhost:${PORT}`)
})