import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { appRouter } from './router/index.js'
import { MongoClient } from 'mongodb'

dotenv.config()

const { PORT, MONGO_URL, MONGO_URL_NEW } = process.env
const app = express()

export const mongo = new MongoClient(MONGO_URL_NEW)
await mongo
  .connect()
  .then(() => console.log('DB connected'))
  .catch((error) => console.error('DB connection error', error.message))

export const db = mongo.db('ittr')
export const users = db.collection('users')
export const tasks = db.collection('tasks')

app.use(express.json())
app.use(cors())

app.get('/', (_, res) => res.status(200).json({ message: 'server is up!' }))

app.listen(PORT, (error) => {
  if (error) return console.error(error.message)
  else console.log(`Server started on port ${PORT}`)
})

app.use('/api', appRouter)
