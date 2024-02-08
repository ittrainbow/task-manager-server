import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema(
  {
    assigned: { type: String, required: true },
    comments: { type: [{ type: String }] },
    creator: { type: String, required: true },
    deadline: { type: Number, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    created: { type: Number, required: true },
    updated: { type: Number, required: true }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Task', TaskSchema)
