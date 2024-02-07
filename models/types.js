import graphql, { GraphQLBoolean, GraphQLFloat } from 'graphql'

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = graphql

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    name: { type: GraphQLString },
    _id: { type: GraphQLString },
    email: { type: GraphQLString }
  })
})

export const UsersType = new GraphQLObjectType({
  name: 'Users',
  fields: () => ({
    users: { type: new GraphQLList(UserType) }
  })
})

export const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    assigned: { type: GraphQLString },
    comments: { type: new GraphQLList(GraphQLString) },
    creator: { type: GraphQLString },
    deadline: { type: GraphQLFloat },
    description: { type: GraphQLString },
    name: { type: GraphQLString },
    status: { type: GraphQLString },
    _id: { type: GraphQLString },
    created: { type: GraphQLFloat },
    updated: { type: GraphQLFloat }
  })
})

export const TasksType = new GraphQLObjectType({
  name: 'Tasks',
  fields: () => ({
    tasks: { type: new GraphQLList(TaskType) }
  })
})

export const AuthType = new GraphQLObjectType({
  name: 'Auth',
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    token: { type: GraphQLString },
    error: { type: GraphQLString }
  })
})

export const UpdateUserType = new GraphQLObjectType({
  name: 'UpdateUser',
  fields: () => ({
    name: { type: GraphQLString },
    error: { type: GraphQLString }
  })
})

export const UpdateTaskType = new GraphQLObjectType({
  name: 'UpdateTask',
  fields: () => ({
    updated: { type: GraphQLFloat },
    error: { type: GraphQLString }
  })
})

export const DeleteTaskType = new GraphQLObjectType({
  name: 'DeleteTask',
  fields: () => ({
    deleted: { type: GraphQLBoolean },
    error: { type: GraphQLString }
  })
})
