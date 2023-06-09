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
                { "password": password }
            ];

            fs.writeFile("database/accounts.json", JSON.stringify(accounts, null, 2), err => {
                if (err) {
                    console.log("error");
                    return;
                }

                res.redirect("/login");
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

app.post("/addtask/submit", (req, res) => {
    fs.access("database/users/" + req.body.addtaskusername + ".json", fs.constants.F_OK, (err) => {
        if (err) {
            //file does not exist
            let userdatatemplate = {
                "tasks": [

                ]
            }

            console.log(userdatatemplate);
            fs.writeFile("database/users/" + req.body.addtaskusername + ".json", JSON.stringify(userdatatemplate), (err) => {
                if (err) {
                    console.log("error creating user data file:", err);
                    return;
                }
                console.log("User data file created successfully!");
                fs.readFile("database/users/" + req.body.addtaskusername + ".json", "utf-8", (err, data) => {
                    if (err) {
                        console.log("error reading accounts");
                    }
                    if (data) {
                        let userdata = JSON.parse(data);
                        userdata.tasks.push(req.body);
                        console.log("userdata: ", userdata);
                        fs.writeFile("database/users/" + req.body.addtaskusername + ".json", JSON.stringify(userdata), (err) => {
                            if (err) {
                                console.log("error adding task", err);
                                return;
                            }
                            res.redirect("/userpage");
                        });
                    }
                });
            });
        } else {
            //file exists
            console.log("file exists");
            fs.readFile("database/users/" + req.body.addtaskusername + ".json", "utf-8", (err, data) => {
                if (err) {
                    console.log("error creating user data file:", err);
                    return;
                }
                if (data) {
                    let userdata = JSON.parse(data);
                    userdata.tasks.push(req.body);
                    console.log(userdata.tasks);
                    fs.writeFile("database/users/" + req.body.addtaskusername + ".json", JSON.stringify(userdata), (err) => {
                        if (err) {
                            console.log("error adding task", err);
                            return;
                        }
                    });
                    res.redirect("/userpage");
                }
            });
        }


    });
});

app.post("/removetask/submit", (req, res) => {
    fs.access("database/users/" + req.body.removetaskusername + ".json", fs.constants.F_OK, (err) => {
        if (err) {
            //file does not exist
            res.status(404).send("file not found <3");
        } else {
            //file exists
            console.log("file exists");
            fs.readFile("database/users/" + req.body.removetaskusername + ".json", "utf-8", (err, data) => {
                if (err) {
                    console.log("error creating user data file:", err);
                    return;
                }
                if (data) {
                    let userdata = JSON.parse(data);
                    //code to delete req.body from userdata.tasks
                    for (let index = 0; index < userdata.tasks.length; index++) {
                        const element = userdata.tasks[index];
                        console.log(index, " element ", element.addtaskname);
                        if (element.addtaskname == req.body.removetaskname) {
                            userdata.tasks.splice(index, 1);
                        }
                    }
                    console.log("lmao it works", req.body.removetaskname);
                    fs.writeFile("database/users/" + req.body.removetaskusername + ".json", JSON.stringify(userdata), (err) => {
                        if (err) {
                            console.log("error removing task", err);
                            return;
                        }
                    });
                    res.redirect("/userpage");
                }
            });
        }
    });
});

//code for when the frontend requests a users/XXX.json file
app.get("/database/users/:username.json", (req, res) => {
    const { username } = req.params;
    console.log("client requesting ", username);
    const filepath = path.join(__dirname, "/database/users", `${username}.json`);
    res.sendFile(filepath, (err) => {
        if (err) {
            res.status(404).send("File not found");
        }
    });
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

