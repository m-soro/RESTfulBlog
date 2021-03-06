# RESTful Blog

## Introduction

**REST**
  - A mapping between HTTP and CRUD
  - Conventional and reliable pattern

    *A Blog example*
      C reate     /blog *as a POST*
      R ead       /allBlogs
      U pdate     /updateBlog
      D estroy    /destroyBlog/:id

  - Representational State Transfer

## RESTful Routing
  - Define REST and explain WHY it matters
  - List all 7 RESTful routes
  - Show example of RESTful routing in practice

  **RESTFUL ROUTES**
  | Route Name | Path          | Verb   | Purpose                                | Mongoose Method         |
  |------------|---------------|--------|----------------------------------------|-------------------------|
  | INDEX      | /dogs         | GET    | List all dogs                          | Dog.find()              |
  | NEW        | /dogs/new     | GET    | Show new dog                           | N/A                     |
  | CREATE     | /dogs         | POST   | Create new dog then redirect           | Dog.create()            |
  | SHOW       | /dogs/:id     | GET    | Show info about one specific dog       | Dog.findById()          |
  | EDIT       | /dog/:id/edit | GET    | Show edit form for one dog             | Dog.findById()          |
  | UPDATE     | /dogs/:id     | PUT    | Update particular dog then, redirect   | Dog.findByIdAndUpdate() |
  | DESTROY    | /dogs:id      | DELETE | Delete a particular dog then, redirect | Dog.findByIdAndRemove() |


## Blog Index
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

## Basic Layout    
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

## Putting C in CRUD
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

## The R in CRUD
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

## The U in CRUD
  * Edit and Update
    - A combination of SHOW and CREATE

  * Add Edit Route
    - `Blog.findById`, `'/blogs/:id'` to find the blog to be edited.
    ```
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
    ```
  * Add Edit Form
    - the `edit.ejs` is almost the same as the `new.ejs` form, except we want the forms to be pre-filled with our blog to be edited.
    - We'll use `value="<%= blog.title %>"` parameter to fill the form.

    ```
    <div class="ui main text container segment">
      <div class="ui huge header">Edit <%= blog.title %> </div>
      <form class="ui form" action="/blogs/<%= blog._id %>" method="PUT">
        <div class="field">
          <label for="Title">Title</label>
          <input type="text" name="blog[title]" value="<%= blog.title %>">
        </div>
        <div class="field">
          <label for="Image">Image</label>
          <input type="text" name="blog[image]" value="<%= blog.image %>">
        </div>
        <div class="field">
          <label for="Blog Content">Blog Content</label>
          <textarea name="blog[body]" rows="8" cols="80" req><%= blog.body %></textarea>
        </div>
        <input type="submit" class="ui blue basic button big">
      </form>
    </div>

    ```
    - change the form action to submit `action="/blogs/<%= blog._id %>"` and change method to `PUT`
    - at this point in edit.ejs if we submit an edit, the edit will only appear as a query string in the address bar, the reason is html forms only supports get and post request, so we will have to use `Method-Override`.

  * Add Update Route
    - `put` means updating something if following REST convention.
    - you can accomplish the same with `post`, but its important that we follow the convention.
    - in app.js `Blog.findByIdAndUpdate(id, data, callback)` asks for three `arguments,req.params.id, req.body.blog, function(req, res)`
    ```
    // UPDATE ROUTE
    app.put('/blogs/:id', function(req, res){
      // find the post and update with the new data with:
      Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
          res.redirect('/blogs');
        } else {
          res.redirect('/blogs/'+ req.params.id);
        }
      });
      // res.send('update route');
    });
    ```

  * Add Update Form

  * Add Method-Override
    - a package `npm install --save method-override`.
    - the we change the edit.ejs form a bit `action="/blogs/<%= blog._id %>?_method=PUT" method="POST"`
    - require it in app.js and tell express to use this.
    - `app.use(methodOverride('_method'));` the `_method` as an argument tells method override to look for `_method` and treat is as such request for us, it was `PUT` in edit.ejs.

## The D in CRUD
  - uses method override with verb `DELETE` and redirect to index.

  * Add Destroy Route
    ```
    // DELETE ROUTE
    app.delete('/blogs/:id', function(req, res){
      // destroy blog
      Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
          res.redirect('/blogs');
        } else {
          res.redirect('/blogs');
        }
      });
      // redirect
      // res.send('This is the Destroy Route');
    });
    ```
  * Add Edit and Destroy Links

  - in show.ejs we needed a form that will send the action to delete route using method-override:
  ```
  <form action="/blogs/<%= blog._id %>?_method=DELETE" method="POST">
    <button class="ui red basic button">DELETE</button>
  </form>
  ```
  - `Blog.findByIdAndRemove(req.params.id, function(err)`, takes only two arguments, the id and the callback function. no need for data since its delete!
  - the edit link is just a `<a href>` tag since we are not sending a form its just a `GET` request.
  - form tags are not block elements not inline.

## Final Touches
  * Sanitize Blog Body
    - To prevent the users to enter any scripts to our form, we'll install sanitizer, `npm install express-sanitizer` then require and use, the only requirement in app.use is that it should come after the body parser in app.js
    - `CREATE` route and `UPDATE` route are the only routes that needs to be sanitized since this is where the users can submit data, `req.body.blog.body = req.sanitize(req.body.blog.body);`.

    ```
    // CREATE ROUTE
    app.post('/blogs', function(req, res){
      // sanitize the data coming from the form
      // console.log(req.body);

      req.body.blog.body = req.sanitize(req.body.blog.body);

      //console.log('==============')
      //console.log(req.body);
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
    - just copy the sanitizer code to `UPDATE` route

  * Style index
  - to give it a centered container:
    `<div class="ui main text container"></div>`
  - to give it a separating line in a box:   
    `<div class="ui top attached segment"></div>`
  - to constrain the image:
    `<div class="image"><img src="<%= blog.image %>" alt="blog image"></div>`
  - in content section make the title an anchor tag so you can click it to go to show page.
    `<a href="/blogs/<%= blog._id %>"> <%= blog.title %></a>`
  - to add a little more info about the content:
    `<div class="meta"><span><%= blog.created.toDateString() %></span></div>`
  - for the actual body of the blog:
    `<div class="description"><p><%- blog.body.substring(0,100) %> ... </p></div>`
  - add an icon the `READ MORE` link
    ```<a class='ui floated basic blue button' href="/blogs/<%= blog._id %>">
      READ MORE
      <i class='right chevron icon'></i>```

  * Update REST Table
