const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const TodoTask = require("./models/getTask");
// const TodoTask = fs.readFile(__dirname + '/models/getTask.js', (err, data) => {
//   return data;
// });
dotenv.config();

app.use("/static", express.static("public"));

//connection to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
console.log("Connected to db!");
app.listen(3000, () => console.log("Server Up and running"));
});

// GET METHOD
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
  res.render("taskList.ejs", { todoTasks: tasks });
  });
  });
  // renders page as taskList.ejs
app.set("view engine", "ejs"); // sets up view engine(ejs)

app.use(express.urlencoded({ extended: true }));

// POST METHOD
app.post('/', async (req, res) => {
  const todoTask = new TodoTask({
  content: req.body.content
  });
  try {
  await todoTask.save();
  res.redirect("/");
  } catch (err) {
  res.redirect("/");
  }
  });

  //UPDATE
app
.route("/edit/:id")
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("taskListEdit.ejs", { todoTasks: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/");
});
});

//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, err => {
  if (err) return res.send(500, err);
  res.redirect("/");
  });
  });