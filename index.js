const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on("connection", socket => {
  console.log("Client connected");

  // Listen for 'stream-audio' event from client
  socket.on("stream-audio", data => {
    // Emit 'audio-stream' event to all connected clients
    io.emit("audio-stream", data);
    io.emit("chat message", data);
  });

  socket.on('chat message', msg => {
    console.log("Chat EMIT : " + msg);
    io.emit('chat message', msg);
  });
  // Listen for client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  
});
http.listen(port,'127.0.0.1', () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
