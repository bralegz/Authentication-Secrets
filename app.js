const express = require("express");
require('dotenv').config()
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt = require('mongoose-encryption');
const mongoose = require("mongoose");

main().catch(err => console.log(err));

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

console.log(process.env.API_KEY);


async function main() {
    await mongoose.connect('mongodb://0.0.0.0:27017/userDB');

    const userSchema = new mongoose.Schema({
        _id: mongoose.ObjectId,
        email: String,
        password: String
    });

    userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

    const User = mongoose.model("User", userSchema);
  

    // Home Route
    app.get("/", (req, res) => {
        res.render("home");
    });

    
    // Register Route
    app.route("/register")
    
    .get((req, res) => {
        res.render("register");
    })
    
    .post((req, res) => {
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.username,
            password: req.body.password
        })

        newUser.save(err => {
            if(!err) {
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    });

    // Login Route
    app.route("/login")
    
    .get((req, res) => {
        res.render("login");
    })

    .post((req, res) => {
        User.findOne({email: req.body.username}, (err, foundUser) => {
            if(!err) {
                if(foundUser.password === req.body.password) {
                    res.render("secrets");
                } else {
                    res.send("Incorrect password")
                }
            } else {
                console.log(err);
            }
        });
    });
    


}








app.listen(3000, () => {
    console.log('Server started on port 3000');
});