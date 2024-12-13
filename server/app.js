const express = require('express')
const { Server } = require('socket.io')
const { createServer } = require('http')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser")


const port = 3000;
const secretKey = "jksdfkjskjfdhk"


const app = express();
const server = createServer(app)


const io = new Server(server, {
    cors: {
        origin: "https://chat-app-room.vercel.app",
        methods: ["GET", "POST"],
        credentials: true
    }
})


app.use(cors({
    origin: "https://chat-app-room.vercel.app",
    methods: ["GET", "POST"],
    credentials: true

}))




app.get("/", (req, res) => {
    res.send("Hello world")
})


app.get("/login", (req, res) => {
    const token = jwt.sign({ _id: "jaskjfhjshdfkjaskjdfh" }, secretKey)

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
        .json({
            message: "login Success"
        })
})



io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
        if (err) return next(err)

        const token = socket.request.cookies.token;

        if (!token) return next(new Error("Authentication Error"))

        const decoded = jwt.verify(token, secretKey)

        // if (!decoded) return next(new Error("Authentication Error"))
        next()

    })
})




io.on("connection", (socket) => {
    console.log("user connected", socket.id)


    socket.on("message", ({ room, message }) => {
        socket.to(room).emit("receive-message", message)
    })


    socket.on('join-room', (room) => {
        socket.join(room)
    })


    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id)
    })

})


server.listen(port, () => {
    console.log(`Server is running on the port ${port}`)
})