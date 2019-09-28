const Post = require('../models/post')

exports.getPosts = (req, res) => {
    const posts = Post.find()
        .then(posts => {
            res.status(200).json({posts: posts})
        })
        .catch(err => console.log(err));
}

exports.createPost = (req, res) => {
    const post = new Post(req.body);
    post.save((err, result) => {
        if(err) {
            res.status(400).json({
                error: err
            });
        }
        res.json(result);
        
    })
}