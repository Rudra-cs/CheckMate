import express from "express";
import { createServer } from "node:http";
import { v4 as uuidv4 } from "uuid";

const app = express();
const server = createServer(app);

server.on("connection", socket);

// upgrade http server to websocket server
const io = new Server(server, {
  cors: "*", // allow connection from any origin
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
