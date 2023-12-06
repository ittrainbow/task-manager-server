import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema(
  {
    creator: {
      type: String,
      required: true
    },

    created: {
      type: Number,
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

    modified: {
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
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Task', TaskSchema)
