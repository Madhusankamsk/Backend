const express = require('express');
const port = 3000;
const app = express();

require('./db');
require('./models/User');

const authRoutes = require('./routes/authRoutes');
const uploadMediaRoutes = require('./routes/uploadMediaRoutes');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(authRoutes);
app.use(uploadMediaRoutes);


app.get('/',(req,res)=>{
    res.send("Hello world");
});


app.listen(port,()=>{
    console.log("Server is running on Port " + port);
});