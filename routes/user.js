const express = require('express');
const router = express.Router();

const {userById, allUsers, getUser, updateUser, deleteUser, hasAuthorization } = require('../controllers/user');
const {requireSignin } = require('../controllers/auth');


/* router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
})*/ 


router.get('/users', allUsers) // to see all users
router.get('/user/:userId', requireSignin, getUser) // to see single user
router.put('/user/:userId', requireSignin, hasAuthorization, updateUser) // to update
router.delete('/user/:userId', requireSignin, hasAuthorization, deleteUser) // to deletes

router.param('userId', userById)

module.exports = router;