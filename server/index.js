const express = require('express');
const socket = require('socket.io')
const http = require('http');

const PORT = process.env.PORT || 3002;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socket(server, {
    cors: {
    origins: 'http://localhost:3002',
    methods:['GET', 'POST']
    }
});

const cors = require('cors');
const { callbackify } = require('util');


app.use(express.json());//sending data to front-end
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(router);

io.on('connection', (socket)=> {
    console.log('We have a new connection!!!')
    console.log(socket.id)

    socket.on('join_room', (data) => { //Important!! 
        socket.join(data);
        console.log("User Joined Room:" + data);
    })

    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive_message", data.content)
    })
    socket.on('disconnect', ()=> {
        console.log('USER DISCONNECTED.')
    })
})

server.listen(PORT, ()=>{
    console.log(`Server Running on Port ${PORT}...`)
});

