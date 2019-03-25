const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const router = express.Router()
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"))

router.get("/", function (request, response) {
    response.sendFile('./public/index.html', { root: __dirname });
});

let clients = 0

io.on('connection', function (socket) {
    socket.on('NewClient', function () {
        console.log('AddClient Run, clients:', clients)
        if (clients < 2) {
            if (clients == 1) {
                console.log('One Client Exists')
                this.emit('CreatePeer')
            }
        }
        else
            this.emit('SessionActive')
        clients++;
    })
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnect', Disconnect)
})

function Disconnect() {
    console.log('Disconnect Run')
    if (clients > 0)
        clients--
}

function SendOffer(offer) {
    this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data)
}

app.use('/', router)
http.listen(port, () => console.log('Active on 3000 port.'));