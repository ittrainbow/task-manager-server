import { body } from 'express-validator'

export const createTask = [
  body('creator').isLength({ min: 24 }),
  body('comments').isArray(),
  body('name').isLength({ min: 1 }),
  body('description').isLength({ min: 1 }),
  body('deadline').isNumeric(),
  body('status').isString()
]

export const updateTask = [
  body('comments').isArray(),
  body('deadline').isNumeric(),
  body('_id').isLength({ min: 24 }),
  body('status').isString()
]

export const removeTask = [body('_id').isLength({ min: 24 })]

export const getOneTask = [body('_id').isLength({ min: 24 })]
