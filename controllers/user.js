const User = require('../models/user')
const jwt = require('jsonwebtoken') // to generate signed token
const expressJwt = require('express-jwt') // for auth check
const {errorHandler} = require('../helper/dbErrorHandler')

exports.signup = (req, res) => {
    // console.log('req.body', req.body);
    const user = new User(req.body);

    user.save((error, user) => {
        if(error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
        user.salt = undefined;
        user.hashed_password = undefined;

        res.json({
            user
        })
    })
}

exports.signin = (req, res) => {
    // find user based on name
    const { email, password} = req.body
    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: 'User by that email does not exist.'
            })
        }
        // if user is found make sure name and password matches
        // create auth method in user model
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password dont match'
            })
        }

        //generate a signed token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)

        // persist the token as 't' in cookie with expiring date
        res.cookie('t', token, {expire: new Date() + 9999})
        
        // return response with user and token to froend client
        const {_id, name, email, role} = user
        return res.json({token, user: {_id, email, name, role}})
    })
}