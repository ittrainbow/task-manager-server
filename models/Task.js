import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
  crator: {
    type: String,
    required: true
  },

  assigned: {
    type: String,
    required: true
  },

  deadline: {
    type: Number,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  _id: {
    type: Number,
    required: true
  },

  lastmodified: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    required: true
  },

  comments: {
    type: [{ type: String }]
  }
})

export default mongoose.model('Task', TaskSchema)
