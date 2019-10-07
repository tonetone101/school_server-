const express = require('express');
const router = express.Router();

const {userById, 
        allUsers, getUser, 
        updateUser, deleteUser, 
        userPhoto, 
        addFollowing, addFollower, 
        removeFollower, removeFollowing,
        findPeople,
        hasAuthorization } = require('../controllers/user');
const {requireSignin, isAuth, isAdmin } = require('../controllers/auth');

router.put('/user/follow', requireSignin, addFollowing, addFollower)
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower)

router.get('/users', allUsers) // to see all users
router.get('/user/:userId', requireSignin, getUser) // to see single user
router.put('/user/:userId', requireSignin, isAuth, updateUser) // to update
router.delete('/user/:userId', requireSignin, isAuth, deleteUser) // to deletes

//photo
router.get('/user/photo/:userId', userPhoto)

// suggested followers
router.get('/user/findpeople/:userId', requireSignin, findPeople)

router.param('userId', userById)

module.exports = router;