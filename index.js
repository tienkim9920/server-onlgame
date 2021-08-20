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

// const mongoose = require("mongoose");

// mongoose.connect("mongodb+srv://tienkim9920:U4tQMg6Wfy8DaL@cluster0.tessf.mongodb.net/Lover?retryWrites=true&w=majority", {
//     useFindAndModify: false,
//     useCreateIndex: false,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })

app.use(cors());

app.use('/', express.static('public'))
app.use(upload());

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

io.on('connection', async (socket) => {
    console.log('a user connected', socket.id);

    socket.on('room', (data) => {
        socket.join(data)
        console.log(`${socket.id} da tham gia phong ${data}`)
    })

    socket.on('position', (data) => {
        socket.in(data.room).emit('position', data)
    })
})


server.listen(PORT, () => {
    console.log('listening on *: ' + PORT);
});