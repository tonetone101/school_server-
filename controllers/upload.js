const Upload = require('../models/upload');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.uploadById = (req, res, next, id) => {
    Upload.findById(id)
        .populate('uploadedBy', '_id name group')
        .populate('comments.uploadedBy', '_id name')
        .populate('uploadedBy', '_id name role group')
        .select('_id title body url created likes comments photo')
        .exec((err, upload) => {
            if (err || !upload) {
                return res.status(400).json({
                    error: err
                });
            }
            req.upload = upload;
            next();
        });
};


exports.getUploads = (req, res) => {
    const uploads = Upload.find()
        .populate("uploadedBy", "_id name photo group")
        .populate("comments", "text created")
        .populate("comments.uploadedBy", "_id name")
        .select("_id title url body created likes")
        .sort({ created: -1 })
        .then(uploads => {
            res.json(uploads);
        })
        .then(uploads => {
            res.download(uploads)
        })
        .catch(err => console.log(err));
};


// with pagination
// exports.getuploads = async (req, res) => {
//     // get current page from req.query or use default value of 1
//     const currentPage = req.query.page || 1;
//     // return 3 uploads per page
//     const perPage = 6;
//     let totalItems;

//     const uploads = await upload.find()
//         // countDocuments() gives you total count of uploads
//         .countDocuments()
//         .then(count => {
//             totalItems = count;
//             return upload.find()
//                 .skip((currentPage - 1) * perPage)
//                 .populate('comments', 'text created')
//                 .populate('comments.uploadedBy', '_id name')
//                 .populate('uploadedBy', '_id name')
//                 .select('_id title body created likes')
//                 .limit(perPage)
//                 .sort({ created: -1 });
//         })
//         .then(uploads => {
//             res.status(200).json(uploads);
//         })
//         .catch(err => console.log(err));
// };

exports.createUpload = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        let upload = new Upload(fields);

        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        upload.uploadedBy = req.profile;

        if (files.photo) {
            upload.photo.data = fs.readFileSync(files.photo.path);
            upload.photo.contentType = files.photo.type;
        }
        upload.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};

exports.uploadsByUser = (req, res) => {
    Upload.find({ uploadedBy: req.profile._id })
        .populate('uploadedBy', '_id name group')
        .select('_id title body url created likes')
        .sort('_created')
        .exec((err, uploads) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(uploads);
        });
};

exports.isUploader = (req, res, next) => {
    let sameUser = req.upload && req.auth && req.upload.uploadedBy._id == req.auth._id;
    let adminUser = req.upload && req.auth && req.auth.role === 'admin';

    // console.log("req.upload ", req.upload, " req.auth ", req.auth);
    // console.log("SAMEUSER: ", sameUser, " ADMINUSER: ", adminUser);

    let isUploader = sameUser || adminUser;

    if (!isUploader) {
        return res.status(403).json({
            error: 'User is not authorized'
        });
    }
    next();
};

// exports.updateupload = (req, res, next) => {
//     let upload = req.upload;
//     upload = _.extend(upload, req.body);
//     upload.updated = Date.now();
//     upload.save(err => {
//         if (err) {
//             return res.status(400).json({
//                 error: err
//             });
//         }
//         res.json(upload);
//     });
// };

exports.updateUpload = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save upload
        let upload = req.upload;
        upload = _.extend(upload, fields);
        upload.updated = Date.now();

        if (files.photo) {
            upload.photo.data = fs.readFileSync(files.photo.path);
            upload.photo.contentType = files.photo.type;
        }

        upload.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(upload);
        });
    });
};

exports.deleteUpload = (req, res) => {
    let upload = req.upload;
    upload.remove((err, upload) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'upload deleted successfully'
        });
    });
};

exports.photo = (req, res, next) => {
    res.set('Content-Type', req.upload.photo.contentType);
    
    return res.send(req.upload.photo.data);
};

exports.singleUpload = (req, res) => {
    return res.json(req.upload);
};

exports.like = (req, res) => {
    Upload.findByIdAndUpdate(req.body.uploadId, { $push: { likes: req.body.userId } }, { new: true }).exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        }
    );
};

exports.unlike = (req, res) => {
    Upload.findByIdAndUpdate(req.body.uploadId, { $pull: { likes: req.body.userId } }, { new: true }).exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        }
    );
};

exports.comment = (req, res) => {
    let comment = req.body.comment;
    comment.uploadedBy = req.body.userId;

    Upload.findByIdAndUpdate(req.body.uploadId, { $push: { comments: comment } }, { new: true })
        .populate('comments.uploadedBy', '_id name')
        .populate('uploadedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};

exports.uncomment = (req, res) => {
    let comment = req.body.comment;

    Upload.findByIdAndUpdate(req.body.uploadId, { $pull: { comments: { _id: comment._id } } }, { new: true })
        .populate('comments.uploadedBy', '_id name')
        .populate('uploadedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};

// exports.updateComment = async (req, res) => {
//     const comment = req.body.comment;
//     // const id = req.body.id;
//     const uploadId = req.body.uploadId;
//     const userId = req.body.userId;
//     // comment.uploadedBy = req.body.userId;

//     const result = await upload.findByIdAndUpdate(
//         uploadId,
//         {
//             $set: {
//                 comments: {
//                     _id: comment._id,
//                     text: comment.text,
//                     uploadedBy: userId
//                 }
//             }
//         },
//         { new: true, overwrite: false }
//     )
//         .populate('comments.uploadedBy', '_id name')
//         .populate('uploadedBy', '_id name');
//     res.json(result);
// };

exports.updateComment = (req, res) => {
    let comment = req.body.comment;

    upload.findByIdAndUpdate(req.body.uploadId, { $pull: { comments: { _id: comment._id } } }).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        } else {
            upload.findByIdAndUpdate(
                req.body.uploadId,
                { $push: { comments: comment, updated: new Date() } },
                { new: true }
            )
                .populate('comments.uploadedBy', '_id name')
                .populate('uploadedBy', '_id name')
                .exec((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: err
                        });
                    } else {
                        res.json(result);
                    }
                });
        }
    });
};