const mongoose = require("mongoose");

const chatSchema=new mongoose.Schema({    //create instance of this class and pass an object
    owner:String,
    ownerName:String,

    friend:String, 
    messages:[ String ],
    lastMessage:String,
    lastMessageSender:String

  })  
  
const Chat=mongoose.model('ChatsOfUsers',chatSchema)

module.exports = Chat;
