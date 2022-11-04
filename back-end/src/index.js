const ConnectionConfig = require("../../ConnectionConfig")

const express = require("express")

const app = express()

app.get("/", (_, res) => {
    res.send("Welcome to ComeOnMan Backend Server!")
})

const server = app.listen(ConnectionConfig.expressPort, ConnectionConfig.serverVirtualIP, () => {
    console.log(`Express: Listening on port ${ConnectionConfig.expressPort}!`)
})

const io = require("socket.io")(server, {
    origins: [`http://${ConnectionConfig.serverVirtualIP}:${ConnectionConfig.expressPort}/`],
    cors: true
})

io.on("connection", (socket) => {
    console.log(socket.id)

    socket.on("SEND_MESSAGE", (data) => {
        io.emit("NEW_MESSAGE", data)
    })
    socket.on("TYPING", (user) => {
        io.emit("PEER_TYPING", user)
    })    
})