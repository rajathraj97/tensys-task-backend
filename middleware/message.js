const { handleMessage } = require("../message/message");

const createMessage = (clients) => {
  return (req, res, next) => {
    let message = `A New Task With Title ${req.body.taskName} was created`;
    handleMessage(clients, message);
    next();
  };
};

const updateMessage = (clients) => {
  return (req, res, next) => {
    let message = `Task Title ${req.body.taskname} status was changed to ${req.body.status}`;
    handleMessage(clients, message);
    next();
  };
};

const deleteMessage = (clients) => {
    return (req, res, next) => {
      let message = `Task was deleted`;
      handleMessage(clients, message);
      next();
    };
  };

module.exports = { createMessage,updateMessage,deleteMessage };
