const express = require('express');
const router = express.Router();

const {userById, allUsers, getUser, updateUser, deleteUser, userPhoto, hasAuthorization } = require('../controllers/user');
const {requireSignin, isAuth, isAdmin } = require('../controllers/auth');


/* router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
})*/ 


router.get('/users', allUsers) // to see all users
router.get('/user/:userId', requireSignin, getUser) // to see single user
router.put('/user/:userId', requireSignin, isAuth, updateUser) // to update
router.delete('/user/:userId', requireSignin, isAuth, deleteUser) // to deletes

//photo
router.get('/user/photo/userId', userPhoto)

router.param('userId', userById)

module.exports = router;