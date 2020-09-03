# RESTful Blog

# Introduction

**REST**
  - A mapping between HTTP and CRUD
  - Conventional and reliable pattern

    *A Blog example*
      C reate     /blog *as a POST*
      R ead       /allBlogs
      U pdate     /updateBlog
      D estroy    /destroyBlog/:id

  - Representational State Transfer

# RESTful Routing
  - Define REST and explain WHY it matters
  - List all 7 RESTful routes
  - Show example of RESTful routing in practice

  **RESTFUL ROUTES**
  | Route Name    	| Path           	| Verb   	| Purpose                                	|
|---------	|----------------	|--------	|----------------------------------------	|
| INDEX   	| /dogs          	| GET    	| List all dogs                          	|
| NEW     	| /dogs/new      	| GET    	| Show new dog form                      	|
| CREATE  	| /dogs          	| POST   	| Create new dog then, redirect          	|
| SHOW    	| /dogs/:id      	| GET    	| Show info about one specific dog       	|
| EDIT    	| /dogs/:id/edit 	| GET    	| Show edit form for one dog             	|
| UPDATE  	| /dogs/:id      	| PUT    	| Update a particular dog then, redirect 	|
| DESTROY 	| /dogs/:id      	| DELETE 	| Delete a particular dog then, redirect 	|


# Blog Index
  * Setup the blog app
    - `npm init`
    - `npm install express mongoose body-parser ejs --save`

  * Create the Blog model
    - same as other schemas. We can set a default object `created: {type: Date, default: Date.now}`

  * Add INDEX route and template
    - Its conventional that the root page redirects to the index page
    ```
    app.get('/', function(req, res){
      res.redirect('/blogs');
    });

    app.get('/blogs', function(req, res){
      res.render('index');
    });
    ```

# Basic Layout    
  * Add Header and Footer partials

  * Include semantic UI
    - include sematic ui min cdn

  * Add a simple Nav Bar with icon
    - use the `public` directory to style the page
    - `<link rel="stylesheet" href="/stylesheets/app.css">` make note of the `/` before the stylesheet
  ```
  <div class="ui fixed inverted menu">
    <div class="ui container"> <!-- just like bootstrap's container -->
      <div class="header item"><i class="code icon"></i>Blog Site</div> <!-- bootstrap's brand, -->
      <a href="/" class="item">Home</a>
      <a href="/blogs/new" class="item">New Post</a>
    </div>
  </div>
  ```

# Putting C in CRUD
  * Add NEW route
    - `new.ejs` file displays the form that creates a blog post. In `app.js` file below is the **NEW route**.
    ```
    app.get('/blogs/new', function(req,res){
      res.render('new');
    });
    ```

  * Add NEW template
    ```
    <div class="ui main text container segment">
      <div class="ui huge header">New Blog</div>
      <form class="ui form" action="/blogs" method="POST">
        <div class="field">
          <label for="Title"></label>
          <input type="text" name="blog[title]" placeholder="title">
        </div>
        <div class="field">
          <label for="Image"></label>
          <input type="text" name="blog[image]" placeholder="image url">
        </div>
        <div class="field">
          <label for="Blog Content"></label>
          <textarea name="blog[body]" rows="8" cols="80" placeholder="Blog post goes here" required></textarea>
        </div>
        <input type="submit" class="ui blue basic button big">
      </form>
    </div>
    ```

  * Add CREATE route
    - In our form, we named the inputs as:
    `name="blog[title]"`, `name="blog[image]"`, `name="blog[body]"`.
    - Meaning they are inside the blog object which has `title`, `image` and `body` automatically as their properties.

  * Add CREATE template
    ```
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
    ```

# The R in CRUD
  * Add show route.
    - To get the unique id from mongo we use `Blog.findByID` which two arguments: `req.params.id` and the callback function.

  ```
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
  ```

  * Add show template
    - in views/show.ejs
    - styled using sematic ui, blog is an object that has title, image, body and created as properties.

    ```
      <%- include ('partials/header') %>

      <div class="ui main text container segment">
        <div class="ui huge header"> <%= blog.title %></div>
        <div class="ui top attached">
          <div class="item">
            <img class="ui centered rounded image" src="<%= blog.image %>" alt="">
            <div class="content">
              <span><%= blog.created.toDateString() %></span>
            </div>
            <div class="description">
              <p><%= blog.body %></p>
            </div>
          </div>
        </div>
      </div>

      <%- include ('partials/footer') %>
    ```

    - **changing the equal sign to a dash** `<%= %>` **to** `<%- %>` evaluates the code not just renders the contents.
    - `<p><%- blog.body.substring(0,100) %> ... </p>` truncate the post so it only shows the first 100 characters.

  * Add links to show page
    - to read more of the blog entry, click read more in index.
    - `<a href="/blogs/<%= blog._id %>">READ MORE</a>` each entry has a unique id from mongo which we can use as identifier.

  * Style the show template
