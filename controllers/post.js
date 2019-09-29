const Post = require('../models/post')
const formidable = require('formidable') // to help with file/image uploads
const fs = require('fs') // gives us access to file system
const _ = require('lodash')

exports.postById = (req, res, next, id) => {
    Post.findById(id)
    .populate('postedBy', '_id name profileImageUrl')
    .exec((err, post) => {
        if(err || !post) {
            return res.status(400).json({
                error: err
            })
        }
        req.post = post
        next()
    })
}

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

exports.isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
    
    
    if(!isPoster) {
        return res.status(403).json({
            error: "User is not authorized"
        })
    }
    next()
}

exports.updatePost = (req, res, next) => {
    let post = req.post 
    post = _.extend(post, req.body)
    post.updated = Date.now()
    post.save(err => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(post)
    })
}

exports.deletePost = (req, res) => {
    let post = req.post 
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            message: "Post deleted successfully"
        })
    })
}