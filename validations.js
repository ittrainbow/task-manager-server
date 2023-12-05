import { body } from 'express-validator'

export const signup = [
  body('email').isEmail(),
  body('password').isLength({ min: 3 }),
  body('name').isLength({ min: 3 })
]

export const login = [body('email').isEmail(), body('password').isLength({ min: 2 })]

export const auth = [body('token').isLength({ min: 128 })]

export const update = [body('uid').isLength({ min: 10 }), body('name').isLength({ min: 2 })]
