function handleMessage(clients, message) {
    clients.forEach((socket) => {
      socket.emit('message', message);
    });
  }
  
  module.exports = {
    handleMessage,
  };