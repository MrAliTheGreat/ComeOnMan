const express = require("express")

const app = express()

app.get("/", (req, res) => {
    res.send("Welcome to ComeOnMan Backend Server!")
})

app.listen(3000, () => {
    console.log("Express: Listening on port 3000!")
})