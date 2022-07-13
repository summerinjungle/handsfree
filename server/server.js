const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://bong:bangbong@hour.z1ipq.mongodb.net/?retryWrites=true&w=majority' , {
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]})
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`);
})
