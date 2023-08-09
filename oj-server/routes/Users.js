const express = require('express');
const UserSchema = require('../models/UserSchema');
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();

// sign up route for the new user 
router.post('/signup', async(req, res) => {
    try {
        const {user_name, user_email, user_password} = req.body;
        // get the user name password and email from the user and check if it is valid 
        if(!user_name || !user_email || !user_password){
            throw new Error("Please fill all the fields");
        }
        // if user with the same email already exists then return error 
        let userExist = await UserSchema.findOne({user_email});
        if(userExist){
            return res.json({message: 'User already exists'});
        }
        // if user if sign up successfully the save the user's password by adding salt in the password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(user_password, salt);

        const user = new UserSchema({
            user_name,
            user_email,
            user_password: hashedPass
        });
        // save the user credentials in the user database 
        await user.save();
        return res.json({message: 'User Creates Successfully'});


    } catch(err){
        return res.json({error: err});
    }
})
// login route for the already signed up user
router.post('/login', async(req, res) => {
    try {
        const {user_email, user_password} = req.body;//get the email and password from the user 
    const user = await UserSchema.findOne({user_email: user_email}); //search for the email in the database to make the user login
    // if email is incorrect then return by showing error
    if(!user){
        return res.json({message: "Invalid credentials no"});
    }
    // if password is incorrect then return by showing error
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    console.log(user_password, user.user_password);
    console.log(isMatch);
    if(!isMatch){
        return res.json({message: "Invalid credentials no"});
    }
    //  Generating the JWT token for the user 
    console.log(user._id, 'userrrrr')
    const token = jwt.sign({id: user._id}, process.env.JWT);
    console.log(token);
    return res.json({message: "Success", token: token, tag: true})
    } catch(err){
        return res.json({error: err.message});
    }
})
// Route to authenticate the user by verifying the token
router.post('/auth', async(req, res) => {
    const token = req.body.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT);
        const userId = decoded.id;

        return res.json({message: `Authenticated user: ${userId}`, tag: true})
    } catch(Err){
        return res.json({error: "Not authenticated"});
    }
})
//route to get the user id from the database
router.post('/get_user_by_id', async(req,res) => {
    const id = req.body.id;
    let user = {};
    user = await UserSchema.findOne({_id: id});
    if(user){
        return res.json({
            message: user,
            tag: true
        })
    }

    return res.json({
        message: user,
        tag: false
    });
})


module.exports = router;