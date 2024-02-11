const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const path = require("path");

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

//New User
io.on("connection", (socket) => {
  socket.on("NewUser", (userName) => {
    socket.userName = userName;
    socket.broadcast.emit("update", userName + "   has joined the room");
  });
  socket.on("Chat", (Message) => {
    socket.broadcast.emit("chatmessage", Message);
  });
  console.log("a user connected");
});

const PORT = process.env.PORT || 5004;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
