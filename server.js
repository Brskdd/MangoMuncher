const http = require('http');
const express = require("express");
const fs = require("fs");
const { stringify } = require('querystring');
const app = express();
const bcrypt = require("bcrypt");
const path = require("path");
app.use(express.urlencoded({ extended: true }));

app.post("/register/submit", async (req, res) => {
    console.log("register submit");
    const username = req.body.registerusername;
    const password = await bcrypt.hash(req.body.registerpassword, 10);
    //console.log('Username:', username);
    //console.log('Password:', password);
    console.log(req.body);

    fs.readFile("database/accounts.json", "utf-8", (err, data) => {
        if (err) {
            console.log("error reading accounts");
            return res.status(500).send('Error reading JSON file');
        }



        let accounts = {};
        if (data) {
            try {
                accounts = JSON.parse(data);
            } catch (err) {
                console.error(err);
                return res.status(500).send('Error parsing JSON file');
            }
        }
        if (accounts[username] == undefined) {
            accounts[username] = [
                {"password" : password}
            ];

            fs.writeFile("database/accounts.json", JSON.stringify(accounts, null, 2), err => {
                if (err) {
                    console.log("error");
                    return;
                }
                res.send("wow congrats it actually worked");
            });
        } else {
            res.send("username already taken");
        }
        
    });
    // Optionally, you can send a response back to the client
});

app.post("/login/submit", async (req, res) => {
    console.log("login submit");
    const username = req.body.loginusername;
    const password = await bcrypt.hash(req.body.loginpassword, 10);
   
    //console.log(req.body.loginpassword, ", ", req.body.loginusername);

    fs.readFile("database/accounts.json", "utf-8", (err, data) => {
        if (err) {
            console.log("error reading accounts");
            return res.status(500).send('Error reading JSON file');
        }



        let accounts = {};
        if (data) {
            try {
                accounts = JSON.parse(data);
            } catch (err) {
                console.error(err);
                return res.status(500).send('Error parsing JSON file');
            }
        }
        if (accounts[username] == undefined) {
            res.send("incorrect login")
        } else {
            console.log(accounts[username][0].password);
            bcrypt.compare(req.body.loginpassword, accounts[username][0].password, (err, result) => {
                if (err) {

                }
                if (result) {

                } else {

                }
                console.log("acct found, ", result);
                //redirect user to actual app now
                res.cookie("username", username);
                console.log(username);
                res.redirect("/userpage");
            })
            
        }
        
    });
    

});

app.get("/userpage", (req, res) => {
    const filepath = path.join(__dirname, "/src", "userpage.html");
    res.sendFile(filepath);
});
app.get("/register", (req, res) => {
    const filepath = path.join(__dirname, "/src", "register.html");
    res.sendFile(filepath);
});
app.get("/addtask/submit", (req, res) => {
    res.send("add task form sent");
    //do code for when user wants to add task
});
app.get("/login", (req, res) => {
    const filepath = path.join(__dirname, "/src", "login.html");
    res.sendFile(filepath);
});
app.get("", (req, res) => {
    const filepath = path.join(__dirname, "/src", "index.html");
    res.sendFile(filepath);
});
app.get("/index", (req, res) => {
    const filepath = path.join(__dirname, "/src", "index.html");
    res.sendFile(filepath);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

