import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.get("/", (req, res) => {
  res.send(`<h1>Hello from this side.</h1>`);
});

io.on("connection", (socket) => {
  console.log("first");
  console.log(socket.id, "connected");

  socket.on("username", (username) => {
    console.log("username:", username);
    socket.data.username = username;
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
