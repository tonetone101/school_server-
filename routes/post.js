const express = require('express');
const {
    getPosts, 
    createPost, 
    postByUser, 
    postById, 
    isPoster, 
    deletePost,
    updatePost,
    photo
} = require('../controllers/post');
const {requireSignin} = require('../controllers/auth');
const {createPostValidator} = require('../validator')
const {userById} = require('../controllers/user')

const router = express.Router();

router.get('/posts', getPosts); // to see all post
router.post('/post/new/:userId', requireSignin, createPost, createPostValidator); // to create new post
router.get('/post/by/:userId', postByUser) // to view post by certain user
router.delete('/post/:postId', requireSignin, isPoster, deletePost)
router.put('/post/:postId', requireSignin, isPoster, updatePost)

//photo
router.get('/post/photo/:postId', photo)

// any routes containing :userId, our app will first execute userById()
router.param('userId', userById)

// any routes containing :postId, our app will first execute postById()
router.param('postId', postById)

module.exports = router