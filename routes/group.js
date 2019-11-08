const express = require('express');
const router = express.Router();

const {createGroup, getGroups} = require('../controllers/group');
const { userById} = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');
const { createGroupValidator } = require('../validator');

router.get('/groups', getGroups)

router.post('/group/new/:userId', requireSignin, createGroup, createGroupValidator);

router.param('userId', userById)

module.exports = router;