const express = require('express');
const {getPosts, createPost} = require('../controllers/post');
const {requireSignin} = require('../controllers/auth');
const validator = require('../validator')

const router = express.Router();

router.get('/', getPosts);
router.post('/createpost', requireSignin, validator.createPostValidator, createPost);



module.exports = router