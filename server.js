const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const users={}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client.html')
});

//every time user loads this website ==> it will call this function
//it gives each user its own socket 
io.on('connection', (socket) => {
    console.log('a new user connected');
    socket.on("new user",userName=>{
      users[socket.id]=userName
    })
    socket.on('chat message', (msg) => {   //it sends down to the client this msg 
        console.log('message: ' + msg);
         socket.broadcast.emit('chat message', {message:msg , name:users[socket.id]});//send msg down to the other clients and the sender's name
      });
  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});