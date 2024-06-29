const Task = require("../models/taskModel");
const pick = require("../node_modules/lodash/pick");
const taskController = {};

taskController.create = async (req, res) => {
  try {
    const body = pick(req.body, ["userId", "tasks"]);
    const data = await Task.find({ _id: body.userId });
    if (!!data) {
      const save_Data = await Task.findByIdAndUpdate(
        body.userId,
        { $push: { tasks: body.task } },
        { new: true, useFindAndModify: true }
      );
      return res.status(200), json({ msg: "success" });
    }
    const task = new Task(body);
    task.save();
    res.status(200).json({ msg: "success" });
  } catch (e) {
    res.status(400).json(e);
  }
};

taskController.update = async (req, res) => {
  try {
    const body = pick(req.body, ["userId", "tasksId","newStatus"]);
    const data = await Task.find({ _id: body.userId });
    if (!data) {
        return  res.status(404).json({msg:"details not found"})
    }
    const save_Data = await Task.findOneAndUpdate(
        { _id: body.userId, 'tasks._id': body.taskId },
        { $set: { 'tasks.$.status': body.newStatus } },
        { new: true, useFindAndModify: false }
      );
   res.status(200).json({ msg: "success" });
  } catch (e) {
    res.status(400).json({msg:e});
  }
};

taskController.delete = async(req,res) =>{
    try{

    }catch(e){
        res.status(400).json({msg:e})
    }
}
