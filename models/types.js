import graphql from 'graphql'

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

export const UpdateType = new GraphQLObjectType({
  name: 'UpdateUser',
  fields: () => ({
    name: { type: GraphQLString },
    error: { type: GraphQLString }
  })
})

export const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    creator: { type: GraphQLString },
    created: { type: GraphQLInt },
    assigned: { type: GraphQLString },
    deadline: { type: GraphQLInt },
    description: { type: GraphQLString },
    name: { type: GraphQLString },
    modified: { type: GraphQLInt },
    status: { type: GraphQLString },
    comments: { type: new GraphQLList(GraphQLString) }
  })
})
