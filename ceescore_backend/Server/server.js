const express = require("express");
const collectionusers = require("./mongo")
const app = express();
var cors = require("cors");
const path = require("path");
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'path_to_your_build_directory')));
app.use(express.urlencoded({ extended: true }))


app.get("/login", function (req, res) {
  res.render("login");
});
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'Home.js'))
});
app.get("/About", function(req, res){
  res.sendFile(path.join(__dirname, 'pages', 'About.js'))
});
app.get("/Favourite", function(req, res){
  res.sendFile(path.join(__dirname, 'pages', 'Favourite.js'))
});
app.get("/Scores",  function(req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'Scores.js'))
});
app.get("/SignUp",  function(req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'SignUp.js'))
});


app.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await collectionusers.findOne({ email: email });

    if (checkUser) {
      res.json("exist");
    } else {
      res.json("not exist");
    }
  } catch (e) {
    res.json("not exist");
  }
})

app.post("/SignUp", async (req, res) => {
   const { email, username, password } = req.body;
  try {
   

    const checkUser = await collectionusers.findOne({ email: email });
    if (checkUser) {
      res.json("exist");
    } 
    else {
      const newUser = new collectionusers({ username, email, password });
      await newUser.save();
      res.json("User Created");
    }
  } catch (e) {
    console.error(e);
    res.json("Failed to create");
  }
})

app.listen(3000, () => {
  console.log("Server is running");
});