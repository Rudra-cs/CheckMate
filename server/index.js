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
//  Define a map to store game state including game time
const gameStates = new Map();

io.on("connection", (socket) => {
    console.log(socket.id, "connected");

    // username
    socket.on("username", (username) => {
        console.log("username:", username);
        socket.data.username = username;
    });

    // createRoom
    socket.on("createRoom", async (callback) => {
        const roomId = uuidv4();
        await socket.join(roomId);
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
        socket.to(data.room).emit("move", data.move);
    });

    // Handling Disconnections
    socket.on("disconnect", () => {
        const gameRooms = Array.from(rooms.values()); // <- 1

        gameRooms.forEach((room) => {
            // <- 2
            const userInRoom = room.players.find(
                (player) => player.id === socket.id
            ); // <- 3

            if (userInRoom) {
                if (room.players.length < 2) {
                    // if there's only 1 player in the room, close it and exit.
                    rooms.delete(room.roomId);
                    return;
                }

                socket.to(room.roomId).emit("playerDisconnected", userInRoom); // <- 4
            }
        });
    });

    // Delete room
    socket.on("closeRoom", async (data) => {
        socket.to(data.roomId).emit("closeRoom", data); // <- 1 inform others in the room that the room is closing

        const clientSockets = await io.in(data.roomId).fetchSockets(); // <- 2 get all sockets in a room

        // loop over each socket client
        clientSockets.forEach((s) => {
            s.leave(data.roomId); // <- 3 and make them leave the room on socket.io
        });

        rooms.delete(data.roomId); // <- 4 delete room from rooms map
    });
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
