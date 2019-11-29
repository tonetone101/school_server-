const Events = require('../models/events');

exports.eventById = (req, res, next, id) => {
    Events.findById(id)
        .populate('uploadedBy', '_id name')
        .populate('uploadedBy', '_id name role')
        // .select('_id title body created likes comments photo')
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: err
                });
            }
            req.post = post;
            next();
        });
};

exports.eventByMembers = (req, res) => {
    let members = req.group.members
    console.log(members)
    members.push(req.group._id)
    Events.find({notifications: { $in: members}})
    .populate('uploadedBy', '_id name')
    .sort('-created')
    .exec((err, events) => {
        console.log(events)
        if(err) {
           console.log(err)
        }
        res.json(events)
        console.log(events)
    })
}

exports.share = (req, res) => {
    Events.findByIdAndUpdate(req.body.eventsId, { $push: { notifications: req.body.uploadId } }, { new: true })
    .populate('uploadedBy', '_id name')
    .exec((err, result) => {
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

exports.removeEvent = (req, res) => {
    Events.findByIdAndUpdate(req.body.eventsId, { $pull: { notifications: req.body.uploadId} }, { new: true })
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