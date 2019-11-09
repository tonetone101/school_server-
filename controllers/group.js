const Group = require('../models/group');
const User = require("../models/user");

// to find group by ID
exports.groupById = (req, res, next, id) => {
    Group.findById(id)
        .populate('createdBy', '_id name')
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

exports.createGroup = (req, res, next) => {  
        let group = new Group(req.body);       
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        group.createdBy = req.profile;

        group.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
}

//get single group
exports.singleGroup = (req, res) => {
    return res.json(req.group);
};

// get all groups
exports.getGroups = (req, res) => {
    console.log(req.body)
    const groups = Group.find()
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
    let group = req.group;
    group = _.extend(group, req.body);
    group.updated = Date.now();
    group.save(err => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(group);
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