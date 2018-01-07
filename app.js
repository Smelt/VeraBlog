var express     = require('express'),
app             = express(),
bodyParser      = require('body-parser'),
mongoose        = require("mongoose"),
http            = require('http');
//app config
mongoose.connect("mongodb://localhost/veri_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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
