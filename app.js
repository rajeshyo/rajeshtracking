const express = require('express')
const app = express()
const port = 3000
const http = require("http")
const path = require('path')
const { stringify } = require('querystring')
const socketio = require("socket.io")

const server = http.createServer(app)

const io = socketio(server)

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/views")));

io.on("connection", function(socket){
  socket.on("send-location", function (data){
    console.log(`${{...data}}`)
    io.emit("receive-location", { id: socket.id, ...data});
  })
    // console.log("connected")
    socket.on("disconnect", function (){
      io.emit("user-disconnected", socket.id);
      
    })
})

app.get("/", (req, res) => {
  res.render("index.ejs");
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




