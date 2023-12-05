import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'

import UserModel from '../models/User.js'
import { users } from '../index.js'

dotenv.config()

const { SECRET_KEY } = process.env

const createToken = ({ id, email }) => {
  return jwt.sign({ id, email }, SECRET_KEY)
}

export const signup = async (req, res, next) => {
  const { email, name, password } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json(errors.array())

  const userExists = await users.findOne({ email })
  if (!!userExists) return res.status(400).json('email already in use')

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)
  const token = createToken(req.body)

  const newUser = new UserModel({ email, name, passwordHash, token })
  const user = await users.insertOne(newUser)
  const responseUser = { uid: user.insertedId, name, email, token }
  return res.status(200).json(responseUser)
}

export const login = async (req, res, next) => {
  const { email, password } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json(errors.array())

  const user = await users.findOne({ email })
  if (!user) return res.status(400).json('user.login: User does not exists')

  const pwdCheck = bcrypt.compareSync(password, user.passwordHash)
  if (!pwdCheck) return res.status(400).json('user.login: Wrong password')

  const token = createToken(req.body)
  users.updateOne({ email }, { $set: { token } })
  const responseUser = { name: user.name, email: user.email, uid: user._id.toString(), token }
  return res.status(200).json(responseUser)
}

export const tokenAuth = async (req, res, next) => {
  const { token } = req.body
  if (!token) return res.json('no token')

  jwt.verify(token, SECRET_KEY, async (error, user) => {
    if (error) return next(res.status(401).json(`user.auth: ${error.message}`))
    const findUser = await users.findOne({ email: user.email })
    const { email, name, _id } = findUser
    const token = createToken(user)
    users.updateOne({ email: user.email }, { $set: { token } })
    const responseUser = { name, email, token, uid: _id.toString() }
    return next(res.status(200).json(responseUser))
  })
}

export const getAll = async (_, res, next) => {
  // const users2 = await users.findOne()
  // console.log(300, users2)
  return next(res.status(200).json('ok'))
}

export const update = async (req, res, next) => {
  const { uid, name } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json(errors.array())

  await users.updateOne({ _id: new ObjectId(uid) }, { $set: { name } })

  return res.status(200).json('OK')
}
