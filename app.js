const express = require('express')
const app = express()
var fs = require('fs');
// const myModule = require('./views/script.js');
const port = 3000
const http = require("http")
const path = require('path')
const { stringify } = require('querystring')
const socketio = require("socket.io")

const server = http.createServer(app)

const io = socketio(server)

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/views")));
// setInterval(() => {
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
// }, 1);


// Endpoint to Get a list of users
app.get('/getUsers', function(req, res){
  fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data){
      console.log(data);
      res.end(data); // you can also use res.send()
  });
})

//Step 1: Create a new user variable
var user = {
    "username":"fg",
    "email":"rajesh@gmail.com",
    "facebook":"facebookid",
    "insta": "instaid"
} 

//The addUser endpoint
app.post('/addUser', function(req, res){
  let id = Math.floor(Math.random() * 1000000000)
  
  //Step 2: read existing users
  fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data){
      data = JSON.parse(data);
      //Step 3: append user variable to list
      data[id] = user;
      fs.writeFile("users.json", JSON.stringify(data), (err)=>{
        if(err) throw err;
        console.log("save data")
      })
      console.log(data);
      res.end(JSON.stringify(data));
  });
})

//Endpoint to get a single user by id
app.get('/:id', function (req, res) {
  // First retrieve existing user list
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     var users = JSON.parse( data );
     var user = users[req.params.id] 
     console.log( user );
     res.end( JSON.stringify(user));
  });
})

 //Code to delete a user by id
 var id = 214801373;
 app.delete('/:id', function (req, res) {
    // First retrieve existing users
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data[req.params.id];
       fs.writeFile("users.json", JSON.stringify(data), (err)=>{
        if(err) throw err;
        console.log("delete data")
      })
       console.log( data );
       res.end( JSON.stringify(data));
    });
 })

app.get("/", (req, res) => {
  res.render("index.ejs");
})

// scriptFile.test()
// let val = myModule.hello();

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




