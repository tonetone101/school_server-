const express = require('express');
const router = express.Router();

const {createGroup, getGroups, 
        removeMember, groupById, 
        deleteGroup, updateGroup,
        groupsByUser, singleGroup,
        groupAdmin
    } = require('../controllers/group');
const { userById} = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');
const { createGroupValidator } = require('../validator');

router.get('/groups', getGroups)

router.post('/group/new/:userId', requireSignin, createGroup, createGroupValidator);
router.put('/group/remove/:groupId', requireSignin, removeMember)
router.get('/groups/by/:userId', requireSignin, groupsByUser);
router.get('/group/:groupId', singleGroup);
router.put('/group/:groupId', requireSignin, groupAdmin, updateGroup);
router.delete('/group/:groupId', requireSignin, groupAdmin, deleteGroup);


router.param('userId', userById)
router.param('groupId', groupById);

module.exports = router;