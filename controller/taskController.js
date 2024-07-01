const { handleMessage } = require("../message/message");
const Task = require("../models/taskModel");
const pick = require("../node_modules/lodash/pick");
var ObjectId = require("mongodb").ObjectId;
const socketIo = require('socket.io');
const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const taskController = {};



taskController.getall = async(req,res) =>{
  try{
    const data = await User.aggregate([{$match:{_id:{$exists:true}}},{$lookup:{from:"tasks",localField:"_id",foreignField:"assigned_user",as:"Tasks"}}],)
    console.log(data)
    res.status(200).json(data)

  }catch(e){
    res.status(400).json({msg:e})
  }
}

taskController.create = async (req, res) => {
  try {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
    const message = 'New Task Created';
    const body = pick(req.body, ["userId", "taskName","details","priority","status","assigned_user"]);
    const data = new Task(body)
    await data.save();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

taskController.update = async (req, res) => {
  try {
    const body = pick(req.body,["_id","status","assigned_user","completedAt"])
    const data = await Task.findOneAndUpdate({_id:body._id},{status:body.status,assigned_user:body.assigned_user,completedAt:body.completedAt},{new:true})
    res.json(data)
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

taskController.delete = async (req, res) => {
  try {
    const body = pick(req.query,["_id"])
    console.log(body)
    const data = await Task.deleteOne({_id:body._id})
    console.log(data)
    res.status(200).json({msg:"deleted sucessfully"})
  } catch (e) {
    res.status(400).json({ msg: e });
  }
};

taskController.getTasks = async(req,res,next) =>{
  try{
    let limit = Number(req.query.limit)
    const data = await Task.aggregate([{$match:{_id:{$exists:true}}},{$limit:limit}])
    res.status(200).json(data)
  }catch(e){
    res.status(400).json({msg:e.message})
  }
}

module.exports = taskController 
