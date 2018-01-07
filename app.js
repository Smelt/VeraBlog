var express     = require('express'),
app             = express(),
bodyParser      = require('body-parser'),
mongoose        = require("mongoose"),
http            = require('http'),
methodOverride   = require("method-override"),
expressSanitizer = require("express-sanitizer");

//app config
mongoose.connect("mongodb://localhost/veri_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:
        {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

/*
Blog.create({
    title: "Are Cats Evil?",
    image: "https://cdn.pixabay.com/photo/2016/03/28/12/35/cat-1285634_960_720.png",
    body: "Quite possibly they are old chap. But there is no definitive evidence proving yes or no. It is best you get some sleep you curious mollusk."

});
*/
app.get("/", function(req, res){
    res.redirect("/blogs");
})
//restful Routes

//index route
app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {blogs: blogs});
        }
    });
})
// new route
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//create Route
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

//edit
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            console.log("Failed");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    })
    
});

//update 
app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//show Page
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    })
});

//delete route
app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err, deletedBlog){
        if(err){
            console.log("Failed at deleting");
        }
        else{
            res.redirect("/blogs");
        }
    })
})

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
