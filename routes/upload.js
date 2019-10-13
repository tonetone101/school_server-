const express = require('express');
const router = express.Router();
const multer = require('multer')


const {
    uploadFile,
    getuploads,
    createupload,
    uploadsByUser,
    uploadById,
    isuploader,
    updateupload,
    deleteupload,
    file,
    singleupload
} = require('../controllers/upload');
const { requireSignin } = require('../controllers/auth');
const { createUploadValidator } = require('../validator');

// router.get('/uploads', getuploads);

// router.post('/upload/new/:uploadId', createupload, createUploadValidator);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

const upload = multer({ storage: storage }).single('file')

router.post('/upload', requireSignin, uploadFile);

// router.param('uploadId', uploadById);

module.exports = router;
