const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require("express");
const cors = require('cors')
const app = express();

dotenv.config({ path: './config.env' });

require('./db/conn');
// const Registration = require('./modal/registrationSchema');

app.use(express.json());
app.use(cors())
//we link the router file to make our route easy
app.use(require('./router/auth'))


const PORT = process.env.PORT;



//Middleware
const middleware = (req, res, next) => {
    console.log("Hello, my middleware");
    next();
}


// app.get('/', (req,res) => {
//     res.send(`hello world from the server app.js`);
// })

app.get('/about', middleware, (req, res) => {
    console.log("Hello, my about");
    res.send(`hello about world from the server`);
})

app.get('/contact', (req, res) => {
    res.send(`hello contact world from the server`);
})

app.get('/signup', (req, res) => {
    res.send(`hello registration world, this is signup page`);
})

app.get('/signin', (req, res) => {
    res.send(`hello login world, this is sign page`);
})



app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`)
})