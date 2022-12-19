const ConnectionConfig = require("../../ConnectionConfig")

const fs = require("fs")
const key = fs.readFileSync("./key.pem")
const cert = fs.readFileSync("./cert.pem")

const express = require("express")
const https = require("https")

const app = express()
const server = https.createServer({key, cert}, app)

app.get("/", (_, res) => {
    res.send("Welcome to ComeOnMan Backend Server!")
})

server.listen(ConnectionConfig.expressPort, ConnectionConfig.serverVirtualIP, () => {
    console.log(`Express: Listening on port ${ConnectionConfig.expressPort}!`)
})

const io = require("socket.io")(server, {
    origins: [`//${ConnectionConfig.serverVirtualIP}:${ConnectionConfig.expressPort}/`],
    cors: true,
    maxHttpBufferSize: 1e10,
    pingTimeout: 100000
})

io.on("connection", (socket) => {
    console.log(socket.id)

    socket.on("SEND_MESSAGE", (data) => {
        io.emit("NEW_MESSAGE", data)
    })
    socket.on("TYPING", (user) => {
        io.emit("PEER_TYPING", user)
    })
    socket.on("DELETE_MESSAGE", (user) => {
        io.emit("PEER_DELETE_MESSAGE", user)
    })
    
    socket.on("RTC_NEW_CANDIDATE", (candidate) => {
        socket.broadcast.emit("ICE_CANDIDATE", candidate)
    })
    socket.on("RTC_NEW_OFFER", (offer) => {
        socket.broadcast.emit("OFFER", offer)
    })
    socket.on("RTC_NEW_ANSWER", ({ answer, receiver }) => {
        io.to(receiver).emit("ANSWER", answer)
    })
    socket.on("RTC_CALL_ENDED", () => {
        socket.broadcast.emit("CALL_ENDED")
    })

    socket.on("LOCAL_VIDEO_OFF", (videoDetails) => {
        socket.broadcast.emit("PEER_VIDEO_OFF", videoDetails)
    })
    socket.on("LOCAL_MIC_OFF", (micStatus) => {
        socket.broadcast.emit("PEER_MIC_OFF", micStatus)
    })
    socket.on("LIVE", (status) => {
        io.emit("PEER_LIVE", status)
    })

    socket.on("UPLOAD", (fileObj) => {
        socket.broadcast.emit("PEER_UPLOAD", fileObj)
    })
    socket.on("FILE_RECEIVED", (uploader) => {
        io.to(uploader).emit("UPLOADED_FILE_RECEIVED")
    })
    socket.on("UPLOADING", (uploader) => {
        socket.broadcast.emit("PEER_UPLOADING", uploader)
    })    
})