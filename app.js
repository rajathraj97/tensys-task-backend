const express = require("./node_modules/express");
const cors = require("./node_modules/cors");
const fs = require("fs");
const http = require("http");
const configuredb = require("./Database/db");
var morgan = require("morgan");
var path = require("path");
// const redis = require("redis");
const { promisify } = require("util");
const userCtlr = require("./controller/userController");
const socketIo = require("socket.io");
const taskController = require("./controller/taskController");
const { handleMessage } = require("./message/message");
const { createMessage, updateMessage, deleteMessage } = require("./middleware/message");
const { validateUserRegistration, validateTaskCreation, validateLogin, deleteTask } = require("./validator/validator");

const app = express();
// const client = redis.createClient();

// const getAsync = promisify(client.get).bind(client);
// const setAsync = promisify(client.set).bind(client);

const server = app.listen(process.env.port, (req,res) => console.log(`Listening on port ${process.env.port}`))
const io = socketIo(server,{ cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }});

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

app.post("/api/register",validateUserRegistration, userCtlr.register);
app.post("/api/login",validateLogin,userCtlr.login)
app.post("/api/createtask",createMessage(clients),validateTaskCreation, taskController.create);
app.put("/api/updatetask", updateMessage(clients),taskController.update);
app.delete("/api/deletetask",deleteMessage(clients),deleteTask,taskController.delete)

app.get("/api", (req, res) => {
  const message = "Hello from server";
  handleMessage(clients, message);
  res.send("Message sent to all connected clients");
});




