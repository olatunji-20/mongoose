

const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

const app = express();


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));




app.get("/", (req, res) => {
    res.sendFile(__dirname + "/formpage.html");
});

app.get("/createuserdb", (req, res) => {

    MongoClient.connect(url, {useUnifiedTopology: true}, (err, db) => {
        if (err) {
            console.log("error in connection...");
            res.send("error in connection...")
        } else {
            console.log("database created....");
            res.send("userDB created...");
        }
        db.close();
    });
});


app.get("/createcollection", (req, res) => {
    MongoClient.connect(url, {useUnifiedTopology: true}, (err, db) => {
        if (err) {
            console.log("error in connection...");
            res.send("error in connection...");
        } else {
            var dbo = db.db("userDB");
            dbo.createCollection("users", (err) => {
                if (err) {
                    console.log("error in query...");
                    res.send("error in query...");
                } else {
                    console.log("users collecction created...");
                    res.send("users collecction created...");
                }
                db.close();
            });
        }
    });
});


app.get("/inserttest", (req, res) => {
    MongoClient.connect(url, {useUnifiedTopology: true}, (err, db) => {
        if (err) {
            console.log("error in connection...");
        } else {
            var dbo = db.db("userDB");
            var obj = {firstname: "sheriff", surname: "falana", email: "falanasheriff@gmail.com", phoneNumber: "07017663584", picture: "", message: "e go be"};

            dbo.collection("users").insertOne(obj, (err) => {
                if(err) {
                    console.log("error in query/...");
                    res.send("error in query...");
                } else {
                    console.log("query successful...");
                    res.send("query successful...");
                }
                db.close();
            });
        }
    });
});


app.get("/seeusers", (req, res) => {
    MongoClient.connect(url, {useUnifiedToplogy: true}, (err, db) => {
        if (err) {
            console.log("error in connection...");
        } else {
            var dbo = db.db("userDB");
            dbo.collection("users").find({}).toArray((err, result) => {
                if(err) {
                    console.log("error in query...");
                    res.send("error in query...");
                } else {
                    console.log("querry successful...");
                    console.log(result);
                    res.send(result);
                }
                db.close();
            });
        }
    });
});


app.post("/", (req, res) => {
    var firstName =  req.body.firstname;
    var surname = req.body.surname;
    var eMail = req.body.email;
    var phoneNumber = req.body.phonenumber;
    var password = req.body.password;
    var pix = req.body.picture;
    var message = req.body.message;

    console.log("the user inputs were " + firstName + ", " + surname + ", " + eMail + ", " + phoneNumber + "," + pix + "," + password + ", and " + message + ". That's all.");

    MongoClient.connect(url, {useUnifiedTopology: true}, (err, db) => {
        if (err) {
            console.log("error in connection....");
        } else {
            var dbo = db.db("userDB");
            var userInfo = {firstname: firstName, surname: surname, email: eMail, phoneNumber: phoneNumber, picture: pix, message: message, password: password};
            dbo.collection("users").insertOne(userInfo, (err, result) => {
                if(err) {
                    console.log("error in query...");
                    res.send("error in query/...");
                } else {
                    res.send("<h1> "+ surname +" "+ firstName +"'s informations has been entered successfully...</h1>");
                    console.log("querry successful...");
                }
                db.close();
            });
        }
    });
});








app.listen(3000, () => {
    console.log("formpageserver running on port 3000..!!!");
})