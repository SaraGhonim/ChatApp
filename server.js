const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose= require('mongoose')
const cors = require('cors');
var bodyParser = require('body-parser')
const userRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoutes');
const Chat = require('./models/Chats');
const {User} = require('./models/user');
const users={}

app.set('views', __dirname + '/routes');
app.set("view engine", "ejs");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors());
app.get('/',(req, res)=>{
  res.sendFile(__dirname + '/client.html')
})  
app.use('/Users', userRouter);
app.use('/Chats', chatRouter);


mongoose.connect('mongodb://localhost:27017/ChatsDB')
  .then(()=> console.log('Connected to Mongodb...'))
  .catch(err=>console.log('Could not connect to MongoDB', err))


async function updateChat(owner,friend,msg){
  console.log("put")
  let chat = await Chat.find({owner:owner,friend:friend});
  let user = await User.find({email:owner});
  
  console.log(user,user[0].name)
  if (chat.length > 0) 
  {
      let updated=chat[0].messages
      updated.push(user[0].name+':'+msg)
      const result = await Chat.findOneAndUpdate({owner:owner,friend:friend}, {
          messages: updated,
          lastMessage:user[0].name+':'+msg,
          lastMessageSender:user[0].name 
      }, {
          new: true
      });   
      console.log("res",result)
  }
  return user[0].name 

}

//every time user loads this website ==> it will call this function
//it gives each user its own socket 
io.on('connection', (socket) => {
    console.log('a new user connected');
  
    socket.on("new user",owner=>{
      users[socket.id]=owner
    })

    socket.on('chat message', (data) => {   //it sends down to the client this msg 
      console.log("here")
        console.log('message:' + data.msg,data.from);
  
        updateChat(data.from,data.to,data.msg).then(val => {
          var name=val
          socket.broadcast.emit('chat message', {message:data.msg , name:name});
          console.log(val);
      }).catch(e => {
          // error
          console.log(e);
      });
      });
  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});