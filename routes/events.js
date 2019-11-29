const express = require('express');
const router = express.Router();

const {eventById, eventByMembers, share} = require('../controllers/events');
const { userById, userPhoto } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');
const { createGroupValidator } = require('../validator');

router.get('/admin/notifications', requireSignin, eventById)
router.put('/admin/addnotifications',requireSignin, share)

module.exports = router;