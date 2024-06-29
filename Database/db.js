const mongoose = require('../node_modules/mongoose')
require('dotenv').config()

const configuredb = async () =>{
    try{
        await mongoose.connect(process.env.url)
        console.log('connected to db')
    }
    catch(e){
        console.log(e)
    }
}

module.exports = configuredb