const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const redis = require("redis")
const users={}


//Connecting redis client
const client = redis.createClient()

client.on('connect', function () {
    console.log("Redis Connected")
});

client.on('error', function (err) {
    console.log("here"+err)
});
 
var sendMessages=function(socket){
  client.lrange("messages",0,-1, (err,data)=>{  //looping through each element in this messages array inside the redis server  
 if(err) console.log(err)
    data.map(x=>{
    const userMessage=x.split(":")  // for each string we sperate the message and the username 
    const redisUserName=userMessage[0] //save username here
    const redisMessage=userMessage[1]  //save message here
    socket.emit('chat message',{message:redisMessage , name:redisUserName}) // send message to the client who joined or reloaded (triggred this event)
  })
 });
 return
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client.html')
    
});



//every time user loads this website ==> it will call this function
//it gives each user its own socket 
io.on('connection', (socket) => {
    console.log('a new user connected');
    sendMessages(socket)  //when a user join the channel bring all the old messages
    socket.on("new user",userName=>{
      users[socket.id]=userName
    })
    socket.on('chat message', (msg) => {   //it sends down to the client this msg 
        console.log('message:' + msg);
        client.rpush("messages",`${users[socket.id]} : ${msg}`) //push this user's msg to the messages array saved in the redis server
        socket.broadcast.emit('chat message', {message:msg , name:users[socket.id]});//send msg down to the other clients and the sender's name
      });
  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});