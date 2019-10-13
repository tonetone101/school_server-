const _ = require('lodash');
const Upload = require('../models/upload');
const formidable = require('formidable');
const fs = require('fs');
const multer = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

const upload = multer({ storage: storage }).single('file')


exports.uploadFile = function(req, res) {
     
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })

}

// exports.uploadById = (req, res, next, id) => {
//     Upload.findById(id)
//         .populate('uploadedBy', '_id name')
//         .populate('comments.uploadedBy', '_id name')
//         .populate('uploadedBy', '_id name')
//         .select('_id title file')
//         .exec((err, upload) => {
//             if (err || !upload) {
//                 return res.status(400).json({
//                     error: err
//                 });
//             }
//             req.upload = upload;
//             next();
//         });
// };


// exports.getUploads = (req, res) => {
//     const uploads = Upload.find()
//         .populate("uploadedBy", "_id name file")
//         .populate("comments", "text created")
//         .populate("comments.uploadedBy", "_id name")
//         .select("_id title file")
//         .sort({ created: -1 })
//         .then(uploads => {
//             res.json(uploads);
//         })
//         .catch(err => console.log(err));
// };

// exports.createUpload = (req, res, next) => {
//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;
//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'File could not be uploaded'
//             });
//         }
//         let upload = new Upload(fields);

//         req.profile.hashed_password = undefined;
//         req.profile.salt = undefined;
//         post.uploadedBy = req.upload;

//         if (files.file) {
//             upload.file.data = fs.readFileSync(files.file.path);
//             upload.file.contentType = files.file.type;
//         }
//         post.save((err, result) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: err
//                 });
//             }
//             res.json(result);
//         });
//     });
// };

// exports.isUploader = (req, res, next) => {
//     let sameUser = req.upload && req.auth && req.post.uploadedBy._id == req.auth._id;
//     let adminUser = req.upload && req.auth && req.auth.role === 'admin';

//     // console.log("req.post ", req.post, " req.auth ", req.auth);
//     // console.log("SAMEUSER: ", sameUser, " ADMINUSER: ", adminUser);

//     let isUploader = sameUser || adminUser;

//     if (!isUploader) {
//         return res.status(403).json({
//             error: 'User is not authorized'
//         });
//     }
//     next();
// };

// exports.updateUpload = (req, res, next) => {
//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;
//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'File could not be uploaded'
//             });
//         }
//         // save post
//         let upload = req.upload;
//         upload = _.extend(upload, fields);
//         upload.updated = Date.now();

//         if (files.file) {
//             upload.file.data = fs.readFileSync(files.file.path);
//             upload.file.contentType = files.file.type;
//         }

//         upload.save((err, result) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: err
//                 });
//             }
//             res.json(upload);
//         });
//     });
// };

// exports.deleteUpload = (req, res) => {
//     let upload = req.upload;
//     upload.remove((err, upload) => {
//         if (err) {
//             return res.status(400).json({
//                 error: err
//             });
//         }
//         res.json({
//             message: 'File deleted successfully'
//         });
//     });
// };

// exports.file = (req, res, next) => {
//     res.set('Content-Type', req.upload.file.contentType);
//     return res.send(req.upload.file.data)

//     ;
// };

// exports.singleUpload = (req, res) => {
//     return res.json(req.upload);
// };