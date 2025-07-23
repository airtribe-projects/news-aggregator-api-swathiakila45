const brcypt = require("bcrypt")
const userModel = require('../model/usersModel')
const jwt = require('jsonwebtoken')
const axios = require("axios")
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
// To query /v2/top-headlines
//Logic on registering the user 
const registerUser = async (req, res) => {
    const { name, username, password } = req.body
    console.log(name)
    user = {
        "name":name,
        "email": username,
        "password":brcypt.hashSync(password,3)
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
    const { username, password } = req.body
    console.log(username, password)
    try {
        // Username Exists
        const dbUser = await userModel.findOne({ email: username });
        if (!dbUser) {
            return res.status(400).json({
                "message": "User not found"
            })
        }

        // Password validation
        // console.log(await brcypt.compare(password, dbUser.password))
        const isMatch = await brcypt.compare(password, dbUser.password)
        console.log(isMatch)
        if (!isMatch) {
            return res.status(400).json({
                "message": "Password Mismatch"
            })
        }

        
        const token = jwt.sign({username:dbUser.email, role: dbUser.role},process.env.JWT_SECRET, {expiresIn: '2h'})
        return res.status(200).json({
            "message": "User validated successfully",
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

const getNewsArticles = async (req, res) => {
    const user = req.body.username 

    try {
        const preference = await userModel.findOne({ email: user }).select('preferences -_id')
        console.log(preference.preferences.categories.join(','))
        if (!preference)
        {
            return res.status(400).send("User Preference cannot be fetched ")
        }
        const params = {
            apiKey: process.env.NEWS_API_KEY,
            pageSize: 10, // Number of articles to fetch (adjust as needed)
        };

        // const newsResponse = await axios.get(process.env.NEWS_API_BASE_URL, { params });


        //Since using the https://newsapi.org/ te categories could not be added in the q parameter since it gives 0 articles and the countries category is not supported with the everything endpoint

        // Have used the node js implementation based on the documentation since axios needs too much modifications in api url
        const newsResponse =  await newsapi.v2.everything({
            
            sources: preference.preferences.sources.join(','),
            language: preference.preferences.languages.join(','),
            page: 1
          })

        console.log(newsResponse)
        if (!newsResponse)
        {
            return res.status(400).send("Error fetching newsarticles")
        }
        console.log(newsResponse)
    
        return res.status(200).json({
            "message": "fetched newsarticles",
            "newsarticles":newsResponse
        })
    }
    catch (error)
    {
        console.log(error)
        return res.status(500).send("Internal server error")
    }
}
module.exports = {registerUser,loginUser,getListofPreferences,modifyPreferences,getNewsArticles}