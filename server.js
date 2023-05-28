const http = require('http');
const express = require("express");
const fs = require("fs");
const { stringify } = require('querystring');
const app = express();
const bcrypt = require("bcrypt")
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
    const username = req.body.registerusername;
    const password = await bcrypt.hash(req.body.registerpassword, 10);
    //console.log('Username:', username);
    //console.log('Password:', password);
    console.log(req.body);


    
    // Optionally, you can send a response back to the client
    res.send('Form data received successfully!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

