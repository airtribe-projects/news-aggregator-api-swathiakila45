const axios = require("axios")
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const userModel = require('../model/usersModel')

const getNewsArticles = async (req, res) => {
    console.log()
    const user = req.user.username 

    try {
        const preference = await userModel.findOne({ email: user }).select('preferences -_id')
        
        const params = {
            apiKey: process.env.NEWS_API_KEY,
            
        };

        //Since using the https://newsapi.org/ te categories could not be added in the q parameter since it gives 0 articles and the countries category is not supported with the everything endpoint

        // Have used the node js implementation based on the documentation since axios needs too much modifications in api url
        // console.log({
            
        //     sources: preference.preferences.sources.join(','),
        //     language: preference.preferences.languages.join(','),
        //     pageSize: 3,  // Number of articles to fetch (adjust as needed)
        //     page: 1
        //   })
        const newsResponse =  await newsapi.v2.everything({
            
            sources: preference.preferences.sources.join(','),
            language: preference.preferences.languages.join(','),
            pageSize: 3,
            page: 1
          })

        // const newsResponse = await axios.get(process.env.NEWS_API_BASE_URL,{ preference})
        if (!newsResponse)
        {
            return res.status(500).send("Error fetching newsarticles")
        }
        // console.log(newsResponse)
    
        return res.status(200).json({
            "message": "fetched newsarticles",
            "news":newsResponse
        })
    }
    catch (error)
    {
        console.log(error)
        return res.status(500).send("Internal server error")
    }
}

module.exports = {getNewsArticles}