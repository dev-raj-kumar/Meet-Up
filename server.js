const express = require('express');
const app = express();
const server = require('http').Server(app);

const io = new require('socket.io')(server);

const {v4 : uuidv4} = require('uuid');

const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug : true
});

app.use('/peerjs',peerServer);
app.set('view engine','ejs');
app.use(express.static('public'));




app.get('/:room', (req,res) => {
    res.render('room',{roomId : req.params.room})
})

app.get('/',(req,res) => {
    res.redirect(`/${uuidv4()}`);
})


io.on('connection', socket =>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.to(roomId).emit('user-connected',userId);
        //console.log(roomId);
        socket.on('message', message => {
            io.to(roomId).emit('createMessage',message);
        })
    })
})

server.listen(process.env.PORT || 3000);
