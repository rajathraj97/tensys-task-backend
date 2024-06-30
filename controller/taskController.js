const { handleMessage } = require("../message/message");
const Task = require("../models/taskModel");
const pick = require("../node_modules/lodash/pick");
var ObjectId = require("mongodb").ObjectId;
const socketIo = require('socket.io');
const { validationResult } = require("express-validator");
const taskController = {};



taskController.create = async (req, res) => {
  try {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
    const message = 'New Task Created';
    const body = pick(req.body, ["userId", "taskName","details","priority","status"]);
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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const body = pick(req.body,["_id"])
    const data = await Task.deleteOne({_id:body._id})
    res.status(200).json({msg:"deleted sucessfully"})
  } catch (e) {
    res.status(400).json({ msg: e });
  }
};

module.exports = taskController 
