const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.urlencoded({ extended: true }))

app.post('/submit', (req, res) => {
    console.log(req.body, res);
});
app.listen(3000, () => {
    console.log('Server running on port 3000');
});