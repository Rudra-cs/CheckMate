import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

const rooms = new Map();

io.on("connection", (socket) => {
    console.log(socket.id, "connected");

    // username
    socket.on("username", (username) => {
        console.log("username:", username);
        socket.data.username = username;
    });

    // createRoom
    socket.on("createRoom", async (callback) => {
        // callback here refers to the callback function from the client passed as data
        const roomId = uuidv4();

        await socket.join(roomId);

        // set roomId as a key and roomData including players as value in the map
        rooms.set(roomId, {
            roomId,
            players: [{ id: socket.id, username: socket.data?.username }],
        });
        // respond with roomId to client by calling
        //  the callback function from the client
        callback(roomId);
    });
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
