//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});

const itemSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemSchema);
const WorkItem = mongoose.model("WorkItem",itemSchema);

const Item_1 = new Item({
  name: "welcome to your todolist",
});

const Item_2 = new Item({
  name: "Hit the + button to add a new item.",
});

const Item_3 = new Item({
  name: "<-- Hit this to delete an item.",
});

const defaultItems = [Item_1, Item_2, Item_3];

 

app.get("/", function (req, res) {
  Item.find({})
    .then(function (foundItems) {
      if (foundItems.length === 0){
        Item.insertMany(defaultItems)
          .then(function(){
            console.log("successfully saved into our DB.")
          })
          .catch(function(err){
            console.log(err);
          });
         }
        console.log(foundItems);
        res.render("list", { listTitle: "Today", newListItems: foundItems });      
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });

  item.save();

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    defaultItems.push(item);
    res.redirect("/");
  }
});

app.post("/delete", function (req, res) {
  const checkboxId = req.body.checkbox;
  Item.findByIdAndRemove(checkboxId)
    .then(()=>{
      defaultItems.slice(4,1);
      console.log("successfully removed")}
      )
    .catch(function (err) {
      console.log(err);
    });
  res.redirect("/");
});

app.post("/remove", function (req, res) {
  const checkboxId = req.body.checkbox;
  WorkItem.findByIdAndRemove(checkboxId)
    .then(()=>{
      console.log("successfully removed")}
      )
    .catch(function (err) {
      console.log(err);
    });
  res.redirect("/work");
});



app.get("/work", function (req, res) {
  WorkItem.find({})
  .then((result)=>{
    res.render("work", { listTitle: "Work List", newListItems: result });
  })
  
});

app.post("/work",function(req,res){
  const workItemName = req.body.newItem;

  const witem = new WorkItem({
    name: workItemName,
  });
  
  witem.save();

  WorkItem.find({})
  .then((result)=>{
   console.log(result)
  })
  .catch((err)=>{
    console.log(err);
  })

  res.redirect("/work");
})

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
