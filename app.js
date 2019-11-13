const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const MongoClient = require('mongodb')
const fs = require('fs')

require('dotenv').config();


//auth routes
const authRoutes = require('./routes/auth');

//user routes
const userRoutes = require('./routes/user');

//group routes
const groupRoutes = require('./routes/group');

//post routes
const postRoutes = require('./routes/post');

// //upload routes
const uploadRoutes = require('./routes/upload');

// our app
const app = express();

//db
// const uri = 'mongodb+srv://Antkeo:Jayna998@cluster0-zsjjd.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(process.env.DATABASE, {
   useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connected'))

// const uri = 'mongodb+srv://Antkeo:Jayna998@cluster0-zsjjd.mongodb.net/test?retryWrites=true&w=majority'
// MongoClient.connect(uri, (err, client) => {
//     console.log(err)
//     // if(err) {
//     //     console.log('Error!!', err)
//     // }
//     // else 
//     // console.log('DB connect...')
//     // const collection = client.db('test').collection('devices')
//     // client.close()
// })

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())



//routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', uploadRoutes);
app.use('/api', groupRoutes);

// app.get('/uploads/view', (req, res) => {
//     res.sendFile("index.html", { root: path.join(__dirname, 'public') })
// })

//to view api Docs
app.get('/', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if(err) {
            res.status(400).json({
                error:err
            })
        }
         const docs = JSON.parse(data)
         res.json(docs)
    })
})


 
// middleware function for unauthorized users error
app.use(function (err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
        res.status(401).json({
            error: 'Unauthorized!'
        })
    }
})




const port = 8000

app.listen(port, () => {
    console.log(` Server is running on port ${port}`)
})