const http = require('http');
const express = require("express");
const app = express();
app.use(express.urlencoded({extended:true}));
app.post("/submit", (req, res) => {
    console.log("submissive and dependable");
    const username = req.body.registerusername;
    const password = req.body.registerpassword;
    console.log('Username:', username);
    console.log('Password:', password);
    // Optionally, you can send a response back to the client
    res.send('Form data received successfully!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

