const bodyParser=require("body-parser");
const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");

const app=express()

//To use EJS as view engine
app.set("view engine","ejs");

//To use the data from the server we should use it 
app.use(bodyParser.urlencoded({extended:true}))

//To display static images and css
app.use(express.static("public"))

//To connect to MongoDB using mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true})

//To Create a new Schema using Mongoose
const articleSchema=new mongoose.Schema({
title:String,
content:String
})

//Create a new model using Mongoose
const Article=mongoose.model("Article",articleSchema)


//To get all the articles from server using express
app.get("/articles",function(req,res){
//To find all the articles from database using Mongoose
Article.find(function(err,foundArticles){
if(!err){
res.send(foundArticles)
}else{
res.send(err)
}
})
})

//To post a article from client to server using express
app.post("/articles",function(req,res){

//A document to insert into database using mongoose
const newArticle=new Article({
title:req.body.title,
content:req.body.content
})

//To save document and send response to client
newArticle.save(function(err){
if(!err){
res.send("Successfully added the article")
}else{
res.send(err)
}

})
})

//To delete all articles using express
app.delete("/articles",function(req,res){
// Deleting from database using Mongoose
Article.deleteMany(function(err){
if(!err){
res.send("Successfully deleted all the articles")
}else{
res.send(err)
}
})
})

//Using Express route handlers to target a specific route
app.route("/articles/:articleTitle")
       .get(function(req,res){
//To find the articles with article title
Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
if(foundArticle){
res.send(foundArticle)
}else{
res.send("No articles match with the title")
}
})
})

//To add an article and to update entire document
      .put(function(req,res){
Article.update(
{title:req.params.articleTitle},//condition
{title:req.body.title,content:req.body.content},//updates
{overwrite:true},
function(err){
if(!err){res.send("Successfully Updated Article")
}else{
res.send(err)
}
}
)
})

.patch(function(req,res){
Article.update(
{title:req.params.articleTitle},
{$set:req.body},
function(err){
if(!err){
res.send("Successfully Patched the Article")
}else{
res.send(err)
}
}
)
})

.delete(function(req,res){
Article.deleteOne(
{title:req.params.articleTitle},
function(err){
if(!err){
res.send("Successfully Deleted the Article")
}else{
res.send(err)
}
}
)
})

app.listen(3000,function(){
console.log("Server Started on Port 3000")
})