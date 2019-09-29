const express = require('express');
const {getPosts, createPost, postByUser} = require('../controllers/post');
const {requireSignin} = require('../controllers/auth');
const {createPostValidator} = require('../validator')
const {userById} = require('../controllers/user')

const router = express.Router();

router.get('/', getPosts); // to see all post
router.post('/post/new/:userId', requireSignin, createPost, createPostValidator); // to create new post
router.get('/posts/by/:userId', requireSignin, postByUser) // to view post by certain user

// any routes containing :userid, our app will first execute userById()
router.param('userId', userById)

module.exports = router