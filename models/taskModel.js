const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Task Schema
const taskSchema = new Schema({
  taskName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  details: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending'
  }
});

// Define the User Schema
const tasksSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  tasks: [taskSchema]
});

// Create the User Model
const Task = mongoose.model('User', tasksSchema);

module.exports = Task