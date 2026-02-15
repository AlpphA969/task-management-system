require('dotenv').config()  
const express = require('express');

const registerroutes = require('../BackEnd/routes/RegisterRoutes')
const loginroutes = require('./routes/LoginRoutes')
const taskroutes = require('./routes/TaskRoutes')


const app = express();
app.use(express.json()) ;
app.use(express.static('../task-manager-frontend/dist'))
app.use(express.urlencoded({ extended: true }));
app.use('' , registerroutes)
app.use('' , loginroutes)
app.use('' , taskroutes)
module.exports = app;
