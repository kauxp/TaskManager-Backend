import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    status:{
        type: String,
        enum : ["pending", "in-Progress", "completed"],
        required: true,
    },
    priority:{
        type: String,
        enum : ["low", "medium", "high"],
        required: true,
    },
    dueDate:{
        type: Date,
    },
})
export default mongoose.model('Task', taskSchema);