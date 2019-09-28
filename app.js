const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
require('dotenv').config();


//user routes
const userRoutes = require('./routes/user');

//post routes
const postRoutes = require('./routes/post');

// our app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
   useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connected'))

//middlewares
app.use(bodyParser.json())
app.use(expressValidator())

//routes middleware
app.use('/api', userRoutes);
app.use('/post', postRoutes);



const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(` Server is running on port ${port}`)
})