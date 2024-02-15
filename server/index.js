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

    // Join Room
    socket.on("joinRoom", async (args, callback) => {
        // check if room exists and has a player waiting
        const room = rooms.get(args.roomId);
        let error, message;

        if (!room) {
            // if room does not exist
            error = true;
            message = "room does not exist";
        } else if (room.length <= 0) {
            // if room is empty set appropriate message
            error = true;
            message = "room is empty";
        } else if (room.players.length >= 2) {
            // if room is full
            error = true;
            message = "room is full"; // set message to 'room is full'
        }

        if (error) {
            // if there's an error, check if the client passed a callback,
            // call the callback (if it exists) with an error object and exit or
            // just exit if the callback is not given

            if (callback) {
                // if user passed a callback, call it with an error payload
                callback({
                    error,
                    message,
                });
            }
            return;
        }

        await socket.join(args.roomId); // make the joining client join the room

        // add the joining user's data to the list of players in the room
        const roomUpdate = {
            ...room,
            players: [
                ...room.players,
                { id: socket.id, username: socket.data?.username },
            ],
        };

        rooms.set(args.roomId, roomUpdate);

        callback(roomUpdate); // respond to the client with the room details.

        // emit an 'opponentJoined' event to the room to tell the other player that an opponent has joined
        socket.to(args.roomId).emit("opponentJoined", roomUpdate);
    });

    // Move event for multiplayer
    socket.on("move", (data) => {
        // emit to all sockets in the room except the emitting socket.
        console.log(data);
        socket.to(data.room).emit("move", data.move);
    });
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
