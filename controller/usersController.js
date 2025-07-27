const bcrypt = require("bcrypt")
const userModel = require('../model/usersModel')
const jwt = require('jsonwebtoken')

// To query /v2/top-headlines
//Logic on registering the user 
const registerUser = async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const preferences = req.body.preferences
    
    if (!email) {
        return res.status(400).send("Email Id missing.")
    }
    user = {
        "name":name,
        "email": email,
        "password": bcrypt.hashSync(password, 3),
        "preferences":preferences
    }

    
    try {

        const newUser = await userModel.create(user)
        return res.status(200).json({
            "message": `User with userId:${user.email} created successfully`
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            "message":"There was an error in creating the User"
        })
    }
}

//Logic for logging in for existing user 
const loginUser = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    console.log(email, password)
    try {
        // Username Exists
        const dbUser = await userModel.findOne({ email: email });
        if (!dbUser) {
            return res.status(400).json({
                "message": "User not found"
            })
        }

        // Password validation
        // console.log(await brcypt.compare(password, dbUser.password))
        const isMatch = await bcrypt.compare(password, dbUser.password)
        console.log(isMatch)
        if (!isMatch) {
            return res.status(401).json({
                "message": "Password Mismatch"
            })
        }

        
        const token = jwt.sign({username:dbUser.email, role: dbUser.role},process.env.JWT_SECRET, {expiresIn: '2h'})
        return res.status(200).json({
            "message": "Login successful",
            "token":token
        })
    }
    catch (error)
    {
        console.log(error)
        return res.status(500).json({ // Use res.status().json()
            message: 'Server error during registration'
        });
    }
}



//Retriving preferences 
const getListofPreferences = async (req, res) => {
    
    const user = req.user.username

    try {
        const userDetails = await userModel.findOne({ email: user });
        const preferences = userDetails.preferences
        return res.status(200).json({
            "preferences": preferences
        })
    }
    catch (error) {
        return res.status(404).send("There was a problem in retriving the preferences.")
    }

}

//To modify the preferences 
const modifyPreferences = async (req, res) => {
    const user = req.user.username
    console.log(user)
    const update = req.body
    const updateQuery = {};
    try {
        for (const key in update) {
            if (['categories', 'languages', 'countries', 'sources'].includes(key))
            {
                updateQuery[`preferences.${key}`] = update[key];
            }
        }
        console.log(updateQuery)
        const updatedUser = await userModel.findOneAndUpdate(
            { email: user },
            { $set: updateQuery }, // Use $set to update only specified nested fields
            { new: true, runValidators: true }
        ).select('preferences -_id')

        res.status(200).json({
            message: 'Preferences updated successfully!',
        });
    }
    catch (error) {
        return res.status(500).send("There was a problem when modifying the preferences")
    }
}


module.exports = {registerUser,loginUser,getListofPreferences,modifyPreferences,}