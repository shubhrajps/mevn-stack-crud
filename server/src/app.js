const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/posts')
var db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
    console.log("Connection successful")
})

var Post = require("../models/post")

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.get('/posts', (req, res) => {
  // res.send(
  //   [{
  //     title: "First Post",
  //     description: "Hello Wordpress! This is my first post"
  //   },{
  //     title: "Second Post",
  //     description: "Hi There! What a sunny day"
  //   }]
  // )
  Post.find({}, 'title description', function (error, posts) {
    if (error) { console.log(error); }
    res.send({
      posts: posts
    })
  }).sort({ _id:-1 })
})

app.post('/savepost', (req, res) => {
  var db = req.db
  var title = req.body.title
  var description = req.body.description
  var new_post = new Post({
    title: title,
    description: description
  })

  new_post.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully'
    })
  })
})

app.get('/getpost/:id', (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, 'title description', function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post)
  })
})

// app.put('/updatepost/:id', (req, res) => {
//   var db = req.db
//   Post.findByIdAndUpdate(req.params.id, {$set:req.body}, function (result, error) {
//     if (error) {
//       console.log(error)
//     }
//     res.send({
//       success: true
//     })
//   })
// })

app.put('/updatepost/:id', (req, res) => {
  var db = req.db
  Post.findById(req.params.id, 'title description', function (error, post) {
    if (error) {
      console.error(err);
    }
    post.title = req.body.title
    post.description = req.body.description
    post.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

app.post('/deletepost/:id', (req, res) => {
  var db = req.db
  Post.deleteOne({ _id: req.params.id }, function (error, result) {
    if (error)
      res.send(error)
    res.send({
      success: true
    })
  })
})

app.listen(process.env.PORT || 8081)
