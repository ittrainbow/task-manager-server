import dotenv from 'dotenv'
import { ObjectId } from 'mongodb'
import { validationResult } from 'express-validator'

import { tasks } from '../index.js'

dotenv.config()

export const create = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json(errors.array())

  const time = new Date().getTime()
  const newTask = { ...req.body, created: time, modified: time }
  const task = await tasks.insertOne(newTask)
  return res.status(200).json({ ...task, time })
}

export const update = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json(errors.array())

  const { comments, deadline, status, assigned } = req.body
  const modified = new Date().getTime()
  await tasks.updateOne(
    { _id: new ObjectId(req.body._id) },
    { $set: { comments, deadline, status, assigned, modified } }
  )
  return res.status(200).json({ modified })
}

export const remove = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json(errors.array())

  await tasks.deleteOne({ _id: new ObjectId(req.body._id) })
  return res.status(200).json('ok')
}

export const getAll = async (_, res) => {
  const cursor = await tasks.find().toArray()
  return res.status(200).json(cursor)
}
