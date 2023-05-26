const http = require('http');
const express = require("express");
const { stringify } = require('querystring');
const app = express();
const bcrypt = require("bcrypt")
app.use(express.urlencoded({extended:true}));
app.post("/submit", async (req, res) => {
    console.log("submissive and dependable");
    const username = req.body.registerusername;
    const password = await bcrypt.hash(req.body.registerpassword, 10);
    console.log('Username:', username);
    console.log('Password:', password);
    // Optionally, you can send a response back to the client
    res.send('Form data received successfully!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

