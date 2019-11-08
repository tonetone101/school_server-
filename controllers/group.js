const Group = require('../models/group');
const User = require("../models/user");

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

exports.getGroups = (req, res) => {
    const groups = Group.find()
        .populate("createdBy", "_id name photo role")
        .select("_id name missionstatement createdBy ")
        .sort({ created: -1 })
        .then(groups => {
            res.json(groups);
        })
        .catch(err => console.log(err));
};
