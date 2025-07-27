require('dotenv').config(); 
const express = require('express');
const app = express();
const port = 3000;
const usersRouter = require('./routes/usersRoutes');
const newsRouter = require('./routes/newsRoutes');
const mongoose = require('mongoose')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', usersRouter)
app.use('/',newsRouter)


mongoose.connect(process.env.MONGODB_URI).then(()=>{
    app.listen(port, (err) => {
        if (err) {
            return console.log('Something bad happened', err);
        }
        console.log(`Server is listening on ${port}`);
    });
})





module.exports = app;