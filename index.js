const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/app.js', function (req, res) {
    res.sendFile(__dirname + '/app.js');
});
app.get('/play-sound.js', function (req, res) {
    res.sendFile(__dirname + '/play-sound.js');
});
app.get('/canvas.js', function (req, res) {
    res.sendFile(__dirname + '/canvas.js');
});

io.on("connection", socket => {
  console.log("Client connected");

  socket.on("stream-audio", data => {
    io.emit("audio-stream", data);
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
// http.listen(port,'0.0.0.0', () => {
//   console.log(`Socket.IO server running at http://localhost:${port}/`);
// });
