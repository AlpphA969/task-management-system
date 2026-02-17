const express = require('express')
const taskvalidate = require('../middlewares/taskvalidate')
const AddTaskController = require('../controllers/AddTaskController')
const GetTaskController = require('../controllers/GetTaskController')
const DeletTaskController = require('../controllers/DeletTaskController')
const { auth } = require('../middlewares/auth')
const EditController = require('../controllers/EditController')
const routes = express.Router()
routes.post('/tasks' ,taskvalidate  , auth, AddTaskController)
routes.get('/tasks' ,auth,GetTaskController)
routes.delete('/tasks/:taskid',auth ,DeletTaskController)
routes.put('/tasks/:taskid',auth,EditController)

module.exports = routes
