require("dotenv").config()


const mongoose = require('mongoose');

const connect = () => {
  mongoose.connect(process.env.NODE_APP_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, (error) => {
    if (error) {
      console.log('Mongo db connection fail ', error);
    } else {
      console.log('Mongo db connection success');
    }
  });
};

mongoose.connection.on('error', (error) => {
  console.error('Mongo db connection error', error);
});
mongoose.connection.on('disconnected', () => {
  console.error('Mongo db disconnected. Attempt to reconnect...');
  connect();
});

module.exports = connect;
