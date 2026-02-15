const express = require('express')
const { validate } = require('../middlewares/validate')
const {LoginController}= require('../controllers/LoginController')
const routes = express.Router()
routes.post('/api/login' ,validate, LoginController )
module.exports = routes