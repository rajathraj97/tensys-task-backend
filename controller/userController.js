const User = require("../models/userModel");
const pick = require("../node_modules/lodash/pick");
const bcrypt = require("../node_modules/bcrypt");
const jwt = require("../node_modules/jsonwebtoken");
const { validationResult } = require("express-validator");
const { promisify } = require("util");
const redis = require("redis");
const { default: mongoose } = require("mongoose");
const { getAsync, setAsync } = require("../app");
const client = require("../Redis/redis");
const NodeCache = require( "node-cache" );
const cache = require("../Redis/redis");
require("dotenv").config();

const userCtlr = {};

userCtlr.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const body = pick(req.body, [
      "username",
      "email",
      "password",
      "address",
      "number",
      "pincode",
    ]);
    console.log(body);
    const user = new User(body);
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(user.password, salt);
    console.log(hashPassword);
    user.password = hashPassword;
    const userDoc = await user.save();
    res.status(200).json(userDoc);
  } catch (e) {
    res.status(404).json(e);
  }
};

userCtlr.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const body = pick(req.body, ["email", "password"]);
    const user = await User.findOne({ email: body.email });
    if (user) {
      const password = bcrypt.compare(body.password, user.password);
      if (password) {
        const tokenData = {
          username: user.username,
          _id: user._id,
          role: user.role,
          email: user.email,
          number: user.number,
        };
        const token = jwt.sign(tokenData, "abc123");
        res.status(200).json(`Bearer ${token}`);
      } else {
        res.status(404).json({ msg: "Invalid Password/Email" });
      }
    } else {
      res.json({ error: "Invalid User" });
    }
  } catch (e) {
    console.log(e);
  }
};

userCtlr.account = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.json(pick(user, ["email", "username"]));
  } catch (e) {
    console.log(e);
  }
};

userCtlr.displayUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (e) {
    res.json(e);
  }
};

userCtlr.changeRole = async (req, res) => {
  try {
    const id = req.params.id;
    const body = pick(req.body, ["role"]);
    const data = await User.findByIdAndUpdate({ _id: id }, { role: body.role });
    res.json(data);
  } catch (e) {
    res.json(e);
  }
};

userCtlr.getUserDetails = async (req, res) => {
  try {
    const myCache = new NodeCache( { stdTTL: 100000, checkperiod: 1200 } );
    const body = pick(req.body, ["userId"]);
    console.log(body);
    const userId = new mongoose.Types.ObjectId(body.userId);
    const cachedData = cache.get(userId.toString());
    console.log(cachedData)
    if (cachedData) {
      return res.send(cachedData);
    }
    const data = await User.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "assigned_user",
          as: "Tasks",
        },
      },
    ]);
    // console.log(data);
    cache.set(userId.toString(), data,10000);
    // const check = myCache.has(userId.toString())
    // console.log(check)
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

userCtlr.getAllUsers = async(Req,res) =>{
  try{
    const data =await User.find()
    res.json(data)
  }catch(e){
    res.status(400).json({msg:e})
  }
}
module.exports = userCtlr;
