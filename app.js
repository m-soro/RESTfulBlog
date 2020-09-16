var methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
    express = require('express'),
    app = express(),


// APP CONFIG
mongoose.connect('mongodb://localhost/restful_blog_app', {
  useNewUrlParser: true, useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// MONGOOSE/MODEL CONFIG
var Schema = mongoose.Schema;
var blogSchema = new Schema({
  title: String,
  body: String,
  image: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//   title: 'Test Blog',
//   image:'https://images.unsplash.com/photo-1598769569852-a8b8f6cfc613?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1352&q=80',
//   body: 'Hello this is a blog post'
// });

// RESTFUL ROUTES

// INDEX ROUTE
app.get('/', function(req, res){
  res.redirect('/blogs');
});

app.get('/blogs', function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log('You hit an error!');
      console.log(err);
    } else {
      res.render('index', {blogs:blogs});
    }
  });
});

// NEW ROUTE
app.get('/blogs/new', function(req,res){
  res.render('new');
});

// CREATE ROUTE
app.post('/blogs', function(req, res){
  // to create a blog post, pass in the blog object from the form
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      res.render('new');
    } else {
      // then, redirect
      res.redirect('/blogs');
    }
  });
});

// SHOW ROUTE
app.get('/blogs/:id', function(req, res){
  // test it with res.send('This is the show page');
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect('/blogs');
    } else {
      res.render('show', {blog:foundBlog});
    }
  });
});

//EDIT ROUTE
app.get('/blogs/:id/edit', function(req, res){
  // find the blog to be edited by:
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect('/blogs');
    } else {
      // render the edit form
      res.render('edit', {blog:foundBlog});
    }
  });
});

// UPDATE ROUTE
app.put('/blogs/:id', function(req, res){
  // find the post and update with the new data with:
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      // if error redirect to index
      res.redirect('/blogs');
    } else {
      // if successful redirect to show page
      res.redirect('/blogs/'+ req.params.id);
    }
  });
  // res.send('update route');
});

app.listen(3000, function(){
  console.log('The RESTful Blog server has started!');
});
