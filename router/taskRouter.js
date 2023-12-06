import express from 'express'

import * as TaskController from '../controllers/task.js'
import * as validate from '../validations.js'

export const taskRouter = express.Router()

taskRouter.post('/create', validate.createTask, TaskController.create)

taskRouter.post('/update', validate.updateTask, TaskController.update)

taskRouter.post('/remove', validate.removeTask, TaskController.remove)

taskRouter.get('/getAll', TaskController.getAll)
