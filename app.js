const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const ejs = require("ejs");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  // Replace 'your-template' with the name of your EJS template file (without the '.ejs' extension)
  res.render('home');
});

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
