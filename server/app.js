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
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})




app.use(cors({

}))
//middleware

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


//for authentication purpose
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














// console.log(data)
// io.emit("receive-message", data)
//entire circuit

// socket.broadcast.emit("receive-message", data)
//here others can see the message



// socket.emit("welcome", `Welcome to the server ${socket.id}`)

// socket.broadcast.emit("welcome", `${socket.id} joined te server`)




// socket.broadcast.emit("welcome", `Welcome to the server ${socket.id}`)
// in broadcast the mentioned person will not get the message but others will get when he reloads