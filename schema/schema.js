import graphql, { GraphQLList } from 'graphql'
import _ from 'lodash'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import Task from '../models/Task.js'
import User from '../models/User.js'

import * as Types from '../models/types.js'

dotenv.config()

const { SECRET_KEY } = process.env

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema } = graphql

const createToken = (email) => {
  const obj = { email, date: new Date().getTime() }
  return jwt.sign(obj, SECRET_KEY)
}

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getUsers: {
      type: Types.UsersType,
      args: {},
      resolve: async (parent, args) => {
        const users = await User.find({}).exec()
        return { users }
      }
    },

    getTasks: {
      type: Types.TaskType,
      args: { _id: { type: GraphQLID } },
      resolve: (parent, args) => {
        // return _.find(authors, { id: Number(args.id) })
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    userCreate: {
      type: Types.AuthType,
      args: { name: { type: GraphQLString }, email: { type: GraphQLString }, password: { type: GraphQLString } },
      resolve: async (parent, args) => {
        const { name, email, password } = args

        const userExists = await User.findOne({ email }).exec()
        if (userExists) return { error: 'User with specified email already exists' }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)
        const token = createToken(email)
        const user = new User({ name, email, passwordHash })
        user.save()

        return { name, email, _id: user._id, token }
      }
    },

    userLogin: {
      type: Types.AuthType,
      args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
      resolve: async (parent, args) => {
        const { email, password } = args
        const { name, _id, passwordHash } = await User.findOne({ email }).exec()
        const passwordCheck = bcrypt.compareSync(password, passwordHash)
        if (!passwordCheck) return { error: 'Password does not match' }
        const token = createToken(email)

        return { name, email, _id, token }
      }
    },

    userAuth: {
      type: Types.AuthType,
      args: { token: { type: GraphQLString } },
      resolve: async (parent, args) => {
        const { token } = args
        if (token) {
          const result = jwt.verify(token, SECRET_KEY, async (error, user) => {
            if (error) return { error: 'Token not valid' }

            const findUser = await User.findOne({ email: user.email }).exec()
            const { name, email, _id } = findUser
            const token = createToken(email)

            return { name, email, _id, token }
          })

          return result
        }
      }
    },

    userUpdate: {
      type: Types.UpdateType,
      args: { name: { type: GraphQLString }, _id: { type: GraphQLString } },
      resolve: async (parent, args) => {
        const { name, _id } = args
        try {
          await User.updateOne({ _id }, { $set: { name } }).exec()
          return { name }
        } catch (error) {
          return { error }
        }
      }
    }
  }
})

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})
