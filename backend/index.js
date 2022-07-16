const express = require('express');
const bodyParser = require('body-parser');
const connect = require('./database/connection');

const apiRouter = require('./routes');

const app = express();
const port = 5000;
connect();

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());

app.use('/api', apiRouter);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
