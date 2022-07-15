const express = require('express');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connect = require('./models');

// const usersRouter = require('./routes/users');
const apiRouter = require('./routes');

const app = express();
const port = 3000;
connect();

// const MONGO_URI = 'mongodb+srv://bongbong:bangbong@handsfree.z1ipq.mongodb.net/?retryWrites=true&w=majority';
// // const MONGO_URI = 'mongodb://127.0.0.1/bong:bangbong@hour.z1ipq.mongodb.net/?retryWrites=true&w=majority'
// mongoose
//   .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Successfully connected to mongodb'))
//   .catch(e => console.error(e));

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());

app.use('/api', apiRouter);
// app.use('/users', usersRouter);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
