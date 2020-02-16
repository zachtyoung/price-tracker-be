const express = require('express'); // importing a CommonJS module

const server = express();
const userRouter = require('./user/userRoutes');
server.use(express.json());
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
server.use('/users', userRouter);


server.get('/', (req, res) => {

  res.send(`
    <h2>Price Tracker API</h2>
    `);
});

module.exports = server;