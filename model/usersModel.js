const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: "String",
        required: true,
        trim:true
    },
    email: {
        type: "String",
        trime: true,
        required: true,
        unique:true
    },
    password: {
        type: "String",
        required:true
    },
    role: {
        type: "String",
        enum: ["admin", "user"],
        default:"user",
        required: true,
        trim:true
    },
    preferences: {
        categories: { 
            type: [String],
            default: [],
            enum:['technology','politics','sports','business']
            
        },
        languages: { 
            type: [String],
            default: [],
        },
        countries: { // e.g., ['us', 'gb', 'in']
            type: [String],
            default: [],
        },
        sources: { 
            type: [String],
            default: [],
        }
    }
        
})


module.exports = mongoose.model('User',userSchema)