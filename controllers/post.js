const Post = require('../models/post')
const formidable = require('formidable') // to help with file/image uploads
const fs = require('fs') // gives us access to file system

//to get all posts
exports.getPosts = (req, res) => {
    const posts = Post.find()
        .populate('postedBy', '_id name profileImageUrl')
        // to select the propery we want to display from post schema
        .select('_id title body')
        .then(posts => {
            res.json({posts})
        })
        .catch(err => console.log(err));
}

exports.createPost = (req, res, next) => {
    //to help with image/file uploads
    // package will give us incoming form fields
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }
        let post = new Post(fields)
        req.profile.hashed_password = undefined
        req.profile.salt = undefined
        req.profile.history = undefined
        console.log(req.profile)

        post.postedBy = req.profile
        if(files.photo) {
            post.photo.data = fs.readFileSync(files.photo.auth)
            post.photo.contentType = files.photo.type
        }
        post.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(result)
        })
    })
}

// to show post by user
exports.postByUser = (req, res) => {
    Post.find({postedBy: req.profile._id})
        // to select what property we want to show from a our post.ref schema which is user
        .populate('postedBy', '_id name profileImageUrl')
        .sort('_created')
        .exec((err, posts) => {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(posts)
        })
}