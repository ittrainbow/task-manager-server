import express from 'express'
import { userRouter } from './userRouter.js'
import { taskRouter } from './taskRouter.js'

export const appRouter = express.Router()

appRouter.use('/user', userRouter)
appRouter.use('/task', taskRouter)
