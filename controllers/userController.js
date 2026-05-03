const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({message: "User created successfully!", user: {id: newUser._id, name, email}});
    } catch (error) {
        res.status(400).json({message: "Error creating user", error: error.message});
    }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};


exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        ).select('-password');

        if (!updatedUser) return res.status(404).json({message: "User not found"});

        res.status(200).json({message: "User updated!", user: updatedUser});
    } catch (error) {
        res.status(400).json({message: "Update failed", error: error.message});
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({message: "User not found"});

        res.status(200).json({message: "User deleted from warehouse"});
    } catch (error) {
        res.status(500).json({message: "Delete failed", error: error.message});
    }
};

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({message: "Authentication required"});
    }


    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];

    if (user === 'admin' && pass === 'password123') {
        next();
    } else {
        res.status(401).json({message: "Invalid credentials"});
    }
};