import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import { graphqlHTTP } from 'express-graphql'
import { schema } from './schema/schema.js'

dotenv.config()

const { PORT, MONGO_URL_NEW } = process.env
const app = express()

mongoose.connect(MONGO_URL_NEW)
mongoose.connection.once('open', () => console.log(`Mongoose connected to 'Railway' DB`))

app.use(express.json())
app.use(cors())

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
)

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
