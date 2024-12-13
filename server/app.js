const express = require('express')
const { Server } = require('socket.io')
const { createServer } = require('http')
const port = 3000;
const cors = require('cors')

const app = express();
const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})
//created the instance of circuit



//sockets are nothing but individual sockets
io.on("connection", (socket) => {
    console.log("user connected")
    console.log("id", socket.id)
    socket.emit("welcome", `Welcome to the server ${socket.id}`)

})

app.use(cors({

}))
//middleware

app.get("/", (req, res) => {
    res.send("Hello world")
})

server.listen(port, () => {
    console.log(`Server is running on the port ${port}`)
})

