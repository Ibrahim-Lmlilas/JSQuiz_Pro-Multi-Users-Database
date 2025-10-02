const express = require('express');
const User = require('./model/userModel');
const app = express();
const port = 3000

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    console.log("Hello World");
    res.render("index", {user: "human"});
})


app.listen(port);