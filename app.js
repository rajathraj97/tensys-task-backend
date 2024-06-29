const express = require("./node_modules/express");
const cors = require("./node_modules/cors");
const fs = require("fs");
const http = require("http")
const configuredb = require("./Database/db");
var morgan = require("morgan");
var path = require("path");
const redis = require("redis");
const { promisify } = require("util");
const userCtlr = require("./controller/userController");
const socketIo = require('socket.io');
const taskController = require("./controller/taskController");

const app = express();
const client = redis.createClient();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const server = http.createServer(app);
const io = socketIo(server);

const clients = new Map();

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  clients.set(socket.id, socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    clients.delete(socket.id);
  });
});

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

configuredb();

app.post("/api/register", userCtlr.register);

app.post("/api/createtask", taskController.create);
app.put("/api/updatetask", taskController.update);

app.listen(process.env.port, () => {
  console.log("listening on port:", process.env.port);
});
