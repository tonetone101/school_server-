const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
require('dotenv').config();


//auth routes
const authRoutes = require('./routes/auth');

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
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())

//routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);

app.use('/post', postRoutes);




const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(` Server is running on port ${port}`)
})