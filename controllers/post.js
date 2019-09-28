const Post = require('../models/post')

//to get all posts
exports.getPosts = (req, res) => {
    const posts = Post.find()
        .select('_id title body')
        .then(posts => {
            res.json({posts})
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