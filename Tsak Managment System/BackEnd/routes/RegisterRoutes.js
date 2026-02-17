const {validate} = require('../middlewares/validate');
const {signupcontroller} = require('../controllers/SignupContrroller')
const express = require('express');
const { auth } = require('../middlewares/auth');
const routes = express.Router();
routes.post('/register',validate,signupcontroller )
module.exports = routes;



