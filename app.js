const express = require("./node_modules/express");
const cors = require("./node_modules/cors");
const fs = require("fs");
const configuredb = require("./Database/db");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

configuredb();




app.listen(process.env.port, () => {
  console.log("listening on port:", process.env.port);
});


