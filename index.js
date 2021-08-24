require("dotenv").config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 4000;

const cors = require("cors");
var upload = require('express-fileupload');

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://tienkim9920:U4tQMg6Wfy8DaL@cluster0.tessf.mongodb.net/Game?retryWrites=true&w=majority", {
    useFindAndModify: false,
    useCreateIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(cors());

app.use('/', express.static('public'))
app.use(upload());

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userAPI = require('./router/user.route');
const User = require("./model/user.model");

app.use('/user', userAPI)

let roomCache = []

io.on('connection', async (socket) => {
    console.log('a user connected', socket.id);

    setInterval(() => {
        
        const newCache = roomCache.filter(value => {
            return parseInt(value.expiredTime) > parseInt(Date.now())
        })

        roomCache = newCache

    }, 90000)

    socket.on('room', (data) => {
        console.log(`${socket.id} da tham gia phong ${data}`)
        socket.join(data)

        const cache = {
            id: socket.id,
            room: data,
            expiredTime: Date.now() + 480000
        }

        roomCache.push(cache)
    })

    //Nhận socket
    socket.on('findRoom', (room) => {

        // Đầu tiên phải getRoom trước
        let getRoom = false

        let player = 0

        roomCache.forEach(value => {
            if (value.room === room){
                player++
                getRoom = true
            }
        })

        // set data để gửi lại client
        const body = {
            player, room, getRoom
        }

        // Lưu vào cache
        const cache = {
            id: socket.id,
            room,
            expiredTime: Date.now() + 480000
        }

        // Kiểm tra xem thử phòng đó có bao nhiêu người chơi
        if (player < 2 && getRoom === true){
            console.log(`${socket.id} da tham gia phong ${room}`)
            socket.join(room)

            roomCache.push(cache)
        
            // Gủi riêng cho chính thg đó :))
            io.to(`${socket.id}`).emit('findRoom', body)
        }else{
            // Gủi riêng cho chính thg đó :))
            io.to(`${socket.id}`).emit('findRoom', body)
        }

    })

    socket.on('position', (data) => {
        socket.in(data.room).emit('position', data)
    })

    socket.on('joinRoom', async (data) => {

        const user = await User.findOne({ _id: data._id })

        socket.in(data.room).emit('joinRoom', user)

    })

    socket.on('returnRoom', async (data) => {

        const user = await User.findOne({ _id: data._id })

        socket.in(data.room).emit('returnRoom', user)

    })

    socket.on('replay', (room) => {
        socket.in(room).emit('replay')
    })

    // Nhận socket rời phòng
    socket.on('leaveRoom', (room) => {

        // Tìm trong cache đối tượng đã rời phòng
        const index = roomCache.findIndex(value => {
            return value.room.toString() === room.toString() && 
            value.id.toString() === socket.id.toString()
        })

        // sau đó xóa nó đi
        roomCache.splice(index, 1)

        socket.in(room).emit('leaveRoom')
    })

    socket.on('send', (data) => {
        socket.in(data.room).emit('receive', data)
    })

    socket.on('keyboard', (data) => {
        socket.in(data.room).emit('keyboard', data)
    })
})


server.listen(PORT, () => {
    console.log('listening on *: ' + PORT);
});