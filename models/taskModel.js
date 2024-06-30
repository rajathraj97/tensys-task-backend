const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tasksSchema = new Schema({
 createdBy:{
    type:String,
    default:"admin"
 },
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
  priority:{
    type:String,
    required:true,
    enum:['high','medium','low'],
    default:"low"
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending'
  },
  assigned_user:{
    type:Schema.Types.ObjectId,
    required:true,
    default:null
  },
  assigned_username:{
    type:String,
    default:null
  },
  completedAt:{
    type:Date,
    default:null
  }
});

// Create the User Model
const Task = mongoose.model('Tasks', tasksSchema);

module.exports = Task