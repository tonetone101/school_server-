const Group = require('../models/group');
const Post = require('../models/post');

const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

// to find group by ID
exports.groupById = (req, res, next, id) => {
    Group.findById(id)
        .populate('createdBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .populate('members', '_id name')
        .populate('createdBy', '_id name role')
        .select('_id name mission created members photo')
        .exec((err, group) => {
            if (err || !group) {
                return res.status(400).json({
                    error: err
                });
            }
            req.group = group;
            next();
        });
};

exports.postByMembers = (req, res) => {
    let members = req.group.members
    console.log(members)
    members.push(req.group._id)
    Post.find({postedBy: { $in: members}})
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .sort('-created')
    .exec((err, posts) => {
        console.log(posts)
        if(err) {
           console.log(err)
        }
        res.json(posts)
        console.log(posts)
    })
}

exports.createGroup = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        console.log(fields)
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        };
        
        let group = new Group(fields);

        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        group.createdBy = req.profile;
        if (files.photo) {
            group.photo.data = fs.readFileSync(files.photo.path, 'utf8');
            group.photo.contentType = files.photo.type;
        }
        group.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};

//get single group
exports.singleGroup = (req, res) => {
    return res.json(req.group);
};

// get all groups
exports.getGroups = (req, res) => {
    console.log(req.body)
    const groups = Group.find()
         .populate("comments", "text created")
        .populate("createdBy", "_id name photo role")
        .select("_id name mission createdBy ")
        .sort({ created: -1 })
        .then(groups => {
            res.json(groups);
        })
        .catch(err => console.log(err));
};

// to remove member from group
exports.removeMember = (req, res) => {
    Group.findByIdAndUpdate(req.body.groupId, { $pull: { members: req.body.userId } }, { new: true })
        .populate('members', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};

// to add member to group
exports.addMember = (req, res) => {
    Group.findByIdAndUpdate(req.body.groupId, { $push: { members: req.body.userId } }, { new: true })
        .populate('members', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};


// exports.addMember = (req, res, next) => {
//     Group.findByIdAndUpdate(req.body.groupId, {$push: {
//         members: req.body.userId
//     }},
//        (err, result) => {
//            if (err) {
//                return res.status(400).json({error: err})
//            }
//            next()
//        } 
//     )
// }

// to find all groups that user created
exports.groupsByUser = (req, res) => {
    Group.find({ createdBy: req.profile._id })
        .populate('createdBy', '_id name')
        .select('_id name mission created members')
        .sort('_created')
        .exec((err, groups) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(groups);
        });
};

//update group information
exports.updateGroup = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save post
        let group = req.group;
        group = _.extend(group, fields);
        group.updated = Date.now();

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        group.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(group);
        });
    });
};

// to delete group page
exports.deleteGroup = (req, res) => {
    let group = req.group;
    group.remove((err, group) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Group deleted successfully'
        });
    });
};

// to create post on group page

//group creator
exports.groupAdmin = (req, res, next) => {
    let sameUser = req.group && req.auth && req.group.createdBy._id == req.auth._id;
    let adminUser = req.group && req.auth && req.auth.role === 'admin';

    console.log("req.group ", req.group, " req.auth ", req.auth);
    console.log("SAMEUSER: ", sameUser, " ADMINUSER: ", adminUser);

    let groupAdmin = sameUser || adminUser;

    if (!groupAdmin) {
        return res.status(403).json({
            error: 'User is not authorized'
        });
    }
    next();
};

exports.groupPhoto = (req, res, next) => {
    res.set('Content-Type', req.group.photo.contentType);
    return res.send(req.group.photo.data);
};

//group comment
exports.comment = (req, res) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;

    Group.findByIdAndUpdate(req.body.groupId, { $push: { comments: comment } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
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

    Group.findByIdAndUpdate(req.body.groupId, { $pull: { comments: { _id: comment._id } } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
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