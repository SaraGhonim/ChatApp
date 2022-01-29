const express = require('express');
const Chat = require('../models/Chats');
const {User} = require('../models/user');

const router = express.Router();


router.get('/getChats/:owner', async(req, res) => {
    console.log("get",req.params.owner);

    const user = await User.find({email:req.params.owner});
    const result = await Chat.find({owner:req.params.owner});
    if(result.length>0){
     res.render('home',{data:{name:user[0].name,messages:result,m:''}})
    }
    else
    {
        res.send("There are no chats yet")
    }
    console.log(result)
})

router.get('/getChat',async (req,res) => {   //retrieve a conversation with a specific user
   
  console.log("get",req.query.friend)
  const chat=await Chat.find({owner:req.query.owner,friend: req.query.friend}) 

  if(chat.length>0){
  res.render('client',{data:{conversation:chat[0].messages,owner:chat[0].owner,friend:chat[0].friend}})
}
else{
    res.send("no such a friend or owner")
}
})


router.post('/addChat', async(req, res) => {
  const chat=new Chat(req.body)
  console.log("post")
  await chat.save(function (err) {if (err) console.log(err)});
  res.send("added successfully ");
})


router.put('/updateChat', async(req, res) => {
    try {
        console.log("put")
        const chat = await Chat.find({owner:req.body.owner, friend: req.body.friend });
        console.log(chat,req.body.msg)
        if (chat.length > 0) 
        {
            let updated=chat[0].messages
            updated.push(req.body.nameOfSender+':'+req.body.msg)
            const result = await Chat.findOneAndUpdate({owner:req.body.owner,friend:req.body.friend}, {
                friend: req.body.friend,
                messages: updated,
                lastMessage:req.body.nameOfSender+':'+req.body.msg
            
            }, {
                new: true
            });
            res.send(result);
         
        } 
        else 
        {
            res.send('This chat is not exist');

        }

    } 
    catch (error)
    {
        console.log(error.message)
    }
})

module.exports = router;