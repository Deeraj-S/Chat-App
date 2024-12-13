import React, { useEffect, useMemo, useState } from 'react'
import { connect, io } from 'socket.io-client'

import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material'

export default function App() {
  const socket = useMemo(() => io("http://localhost:3000/", { withCredentials: true }), [])


  const [message, setMessage] = useState("")
  const [room, setRoom] = useState("")
  const [roomName, setRoomName] = useState("")
  const [socketId, setSocketId] = useState("")
  const [messages, setMessages] = useState([])

  console.log(messages)
  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit("message", { message, room })
    setMessage("")
  }

  const joinRomeHandler = (e) => {
    e.preventDefault()
    socket.emit('join-room', roomName)
    setRoomName("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id)
      console.log("connected", socket.id)
    })

    socket.on("receive-message", (data) => {
      console.log(data)
      setMessages((messages) => [...messages, data])
    })

    socket.on("welcome", (s) => {
      console.log(s)

    });

    return () => {
      socket.off("connect")
      socket.off("receive-message")
    }



  }, [socket])
  return (
    <>
      <Box sx={{ height: 400 }} />
      <Container maxWidth="sm">
        <Typography variant='h5' component="div" gutterBottom>
          Welcome to Socket.io

        </Typography >

        <Typography variant='h7' component="div" gutterBottom >
          {socketId}

        </Typography>

        <form onSubmit={joinRomeHandler}>
          <h5>Join Room</h5>
          <TextField value={roomName} id="outlined-basic " label="Room Name" variant='outlined'
            onChange={(e) => setRoomName(e.target.value)} />
          <Button type='submit' variant='contained' color='primary'>Join</Button>
        </form>


        <form onSubmit={handleSubmit}>
          <TextField value={message} id="outlined-basic " label="Message" variant='outlined'
            onChange={(e) => setMessage(e.target.value)} />

          <TextField value={room} id="outlined-basic " label="Room" variant='outlined'
            onChange={(e) => setRoom(e.target.value)} />
          <Button type='submit' variant='contained' color='primary'>Send</Button>
        </form>

        <Stack>
          {messages.map((m, i) => (
            <Typography key={i} variant='h7' component="div" gutterBottom>
              {m}

            </Typography>
          ))}
        </Stack>



      </Container>
    </>
  )
}
