import express from 'express'

import * as validate from '../validations.js'
import * as UserController from '../controllers/user.js'

export const userRouter = express.Router()

userRouter.post('/signup', validate.signup, UserController.signup)

userRouter.post('/login', validate.login, UserController.login)

userRouter.post('/tokenAuth', validate.auth, UserController.tokenAuth)

userRouter.post('/update', validate.update, UserController.update)

userRouter.get('/getAll', validate.update, UserController.getAll)
