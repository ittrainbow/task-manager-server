import express from 'express'
import { userRouter } from './userRouter.js'

export const appRouter = express.Router()

appRouter.use('/user', userRouter)
