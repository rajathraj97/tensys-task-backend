const express = require("./node_modules/express");
const cors = require("./node_modules/cors");
const fs = require("fs");
const configuredb = require("./Database/db");
var morgan = require('morgan')
var path = require('path')
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const client = redis.createClient();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

configuredb();





app.listen(process.env.port, () => {
  console.log("listening on port:", process.env.port);
});


