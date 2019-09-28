const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

//user routes
const userRoutes = require('./routes/user');

// our app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
   useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connected'))

//routes middleware
app.use('/api', userRoutes);

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(` Server is running on port ${port}`)
})