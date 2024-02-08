import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'

import { users } from '../index.js'

dotenv.config()

const { SECRET_KEY } = process.env

const createToken = ({ id, email }) => {
  return jwt.sign({ id, email }, SECRET_KEY)
}

export const signup = async (req, res) => {
  const { email, name, password } = req.body

  if (!name || !password) return res.status(400).json('Provide valid data')
  const userExists = await users.findOne({ email })
  if (userExists) return res.status(400).json('Email already in use')

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)
  const token = createToken(req.body)

  const newUser = { name, email, passwordHash, token }
  const user = await users.insertOne(newUser)
  const responseUser = { _id: user.insertedId, name, email, token }
  return res.status(200).json(responseUser)
}

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) return res.status(400).json('Provide correct data')
  const user = await users.findOne({ email })
  if (!user) return res.status(400).json('user.login: User does not exists')
  const pwdCheck = bcrypt.compareSync(password, user.passwordHash)
  if (!pwdCheck) return res.status(400).json('user.login: Wrong password')

  const token = createToken(req.body)
  users.updateOne({ email }, { $set: { token } })
  const responseUser = { name: user.name, email: user.email, _id: user._id.toString(), token }
  return res.status(200).json(responseUser)
}

export const tokenAuth = async (req, res, next) => {
  const { token } = req.body
  if (!token) return res.json()

  jwt.verify(token, SECRET_KEY, async (error, user) => {
    if (error) return next(res.status(401).json(`user.auth: ${error.message}`))
    const findUser = await users.findOne({ email: user.email }, { projection: { _id: 1, token: 1, name: 1, email: 1 } })
    const { email, name, _id } = findUser
    const token = createToken(findUser)
    users.updateOne({ email: user.email }, { $set: { token } })
    const responseUser = { name, email, token, _id: _id.toString() }
    return res.status(200).json(responseUser)
  })
}

export const getAll = async (_, res) => {
  const cursor = await users.find().toArray()
  return res.status(200).json(cursor)
}

export const update = async (req, res) => {
  const { name } = req.body
  await users.updateOne({ _id: new ObjectId(req.body._id) }, { $set: { name } })
  return res.status(200).json('OK')
}
