const User = require('../models/userModel')
const pick = require('../node_modules/lodash/pick')
const bcrypt = require('../node_modules/bcrypt')
const jwt = require('../node_modules/jsonwebtoken')
require('dotenv').config()


const userCtlr = {}

userCtlr.register = async(req,res)=>{
    try{
        const body = pick(req.body,['username','email','password','address','role','number','pincode'])
        console.log(body)
        const user = new User(body)
        const salt =await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(user.password,salt)
        console.log(hashPassword)
        user.password = hashPassword
        const userDoc = await user.save()
        res.json(userDoc)
        
    }catch(e){
res.status(404).json(e)
    }
}

userCtlr.login = async(req,res) =>{
   try{
    const body = pick(req.body,["email","password"])
    const user =await User.findOne({email:body.email})
    if(user){
        const password = bcrypt.compare(body.password,user.password)
        if(password){
            const tokenData = {
                username:user.username,
                _id:user._id,
                role:user.role,
                email:user.email,
                number:user.number
                
            }
            const token = jwt.sign(tokenData,"abc123")
            res.status(200).json(`Bearer ${token}`)
        }else{
        res.status(404).json({msg:"Invalid Password/Email"})
        }
    }else{
        res.json({error:"Invalid User"})
    }

   }
   catch(e){
    console.log(e)
   }
}



userCtlr.account = async(req,res) =>{
    try{
    const user = await User.findOne({_id:req.user._id})
    res.json(pick(user,['email','username']))
    }catch(e){
        console.log(e)
    }
}

userCtlr.displayUsers = async(req,res) =>{
    try{
        const user = await User.find()
        res.json(user)
    }
    catch(e){
        res.json(e)
    }
}

userCtlr.changeRole = async(req,res) =>{
    try{
        const id = req.params.id
        const body = pick(req.body,['role'])
        const data = await User.findByIdAndUpdate({_id:id},{role:body.role})
        res.json(data)
    }
    catch(e){
        res.json(e)
    }
}





module.exports = userCtlr