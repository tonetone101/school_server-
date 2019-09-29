const User = require('../models/user')

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        req.profile = user;
        next()
    })
}

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if(err ) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            users
        })
    }).select('name email role updated created')
}

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    req.profile.history = undefined

    return res.json(req.profile)
}

exports.updateUser = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.profile._id}, 
        {$set: req.body}, 
        {new: true},
        (err, user) => {
            if(err) {
                return res.status(400).json({
                    error: 'You are not authorized to perform these actions'
                })
            }
            user.hashed_password = undefined
            user.salt = undefined
            user.history = undefined
            res.json(user);
        }
    )
}

exports.deleteUser = (req, res) => {
    let user = req.profile;
    user.remove((err, user) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({message: "User deleted successfully"});
    })
}

