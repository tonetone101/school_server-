const express = require('express');
const {
    getUploads,
    createUpload,
    uploadsByUser,
    uploadById,
    isUploader,
    updateUpload,
    deleteUpload,
    photo,
    singleUpload,
    like,
    unlike,
    comment,
    uncomment,
    updateComment
} = require('../controllers/upload');

 const { requireSignin } = require('../controllers/auth');
 const { userById, userPhoto } = require('../controllers/user');
 const { createPostValidator } = require('../validator');

const router = express.Router();

router.get('/uploads', getUploads);

// like unlike
router.put('/upload/like', requireSignin, like);
router.put('/upload/unlike', requireSignin, unlike);

// comments
router.put('/upload/comment', requireSignin, comment);
router.put('/upload/uncomment', requireSignin, uncomment);
router.put('/upload/updatecomment', requireSignin, updateComment);

// upload routes
router.post('/upload/new/:userId', requireSignin, createUpload);
router.get('/uploads/by/:userId', requireSignin, uploadsByUser);
router.get('/upload/:uploadId', singleUpload);
router.put('/upload/:uploadId', requireSignin, isUploader, updateUpload);
router.delete('/upload/:uploadId', requireSignin, isUploader, deleteUpload);

//uploads
// router.upload('/upload', uploader)

// photo
router.get('/upload/photo/:uploadId', photo, userPhoto);

// any route containing :userId, our app will first execute userById()
router.param('userId', userById);
// any route containing :uploadId, our app will first execute uploadById()
router.param('uploadId', uploadById);

module.exports = router;
