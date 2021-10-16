const express = require("express");
const bodyParser = require("body-parser");
const upload = require("express-fileupload");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/profileDB", { useNewUrlParser: true });

const profileSchema = new mongoose.Schema({
    firstname: String,
    surname: String,
    email: String,
    phonenumber: Number,
    password: String,
    pics: {
        data: Buffer,
        contentType: String
    },
    message: String
});



const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.json());
app.use(upload());


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/formpage.html");
});

app.post("/", (req, res) => {

    res.send("Your inputs were " + req.body.firstname + " and" + " " + req.body.surname + " " + "and " + req.body.message);
    console.log(req.body);
    console.log(req.files);

    const file = req.files.pics;
    const fileName = file.name;
    const userName = req.body.firstname + " " + req.body.surname;

    const User = mongoose.model("profile", profileSchema);

    const newUser = new User({
        firstname: req.body.firstname,
        surname: req.body.surname,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        password: req.body.password,
        pics: req.files.pics,
        message: req.body.message
    });

    newUser.save((err) => {
        if (err) {
            console.log("error in database....");
            console.log("ERRROOROOOOOROOROROROROORRORORORO" + err);
        } else {
            console.log("database query saved sucessfully...");
        }
    });




    file.mv("./uploads/" + userName + "'s" + " " + fileName, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(userName + "'s" + " file uploaded sucessfully....");
        }
    });
});

app.listen(3000, () => {
    console.log("server running on port 3000.....");
});