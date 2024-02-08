import graphql, { GraphQLFloat } from 'graphql'
import _ from 'lodash'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import Task from '../models/Task.js'
import User from '../models/User.js'

import * as Types from '../models/types.js'

dotenv.config()

const { SECRET_KEY } = process.env

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } = graphql

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
      resolve: async () => {
        const users = await User.find({}).exec()
        return { users }
      }
    },

    getTasks: {
      type: Types.TasksType,
      args: {},
      resolve: async () => {
        const tasks = await Task.find({}).exec()
        return { tasks }
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
      type: Types.UpdateUserType,
      args: { name: { type: GraphQLString }, _id: { type: GraphQLString } },
      resolve: async (parent, args) => {
        const { name, _id } = args
        await User.updateOne({ _id }, { $set: { name } }).exec()

        return { name }
      }
    },

    taskCreate: {
      type: Types.TaskType,
      args: {
        assigned: { type: GraphQLString },
        creator: { type: GraphQLString },
        deadline: { type: GraphQLFloat },
        description: { type: GraphQLString },
        name: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        const date = new Date().getTime()
        const task = new Task({ ...args, comments: [], status: 'new', created: date, updated: date })

        return task.save()
      }
    },

    taskUpdate: {
      type: Types.UpdateTaskType,
      args: {
        _id: { type: GraphQLString },
        assigned: { type: GraphQLString },
        comments: { type: new GraphQLList(GraphQLString) },
        deadline: { type: GraphQLFloat },
        status: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        const { _id, assigned, comments, deadline, status } = args
        const updated = new Date().getTime()
        await Task.updateOne(
          { _id },
          { $set: { assigned, comments, deadline, status, updated: new Date().getTime() } }
        ).exec()

        return { updated }
      }
    },

    taskDelete: {
      type: Types.DeleteTaskType,
      args: { _id: { type: GraphQLString } },
      resolve: async (parent, args) => {
        const { _id } = args
        await Task.deleteOne({ _id }).exec()
        return { deleted: true }
      }
    }
  }
})

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})
