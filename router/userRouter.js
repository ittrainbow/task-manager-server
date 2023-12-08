import express from 'express'

import * as UserController from '../controllers/user.js'

export const userRouter = express.Router()

userRouter.post('/signup', UserController.signup)

userRouter.post('/login', UserController.login)

userRouter.post('/tokenAuth', UserController.tokenAuth)

userRouter.post('/update', UserController.update)

// userRouter.post('/recover', UserController.recover)

userRouter.get('/getAll', UserController.getAll)
