/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import socket from "../connection/Socket";

export function Game({ players, room, orientation, cleanup }) {
    const chess = useMemo(() => new Chess(), []); // <- 1
    const [fen, setFen] = useState(chess.fen()); // <- 2
    const [over, setOver] = useState("");
    const [whiteTime, setWhiteTime] = useState(180); // 3 minutes in seconds
    const [blackTime, setBlackTime] = useState(180); // 3 minutes in seconds
    const [intervalId, setIntervalId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const isWhiteTurn = chess.turn() === "w";
    const bgClass =
        isWhiteTurn === (orientation === "white") ? "bg-gray-500" : "bg-black";
    const bgClassBlack =
        isWhiteTurn === (orientation === "black") ? "bg-gray-500" : "bg-black";

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    }

    // Move Function
    const makeAMove = useCallback(
        (move) => {
            try {
                const result = chess.move(move); // update Chess instance

                setFen(chess.fen()); // update fen state to trigger a re-render

                console.log(
                    "over, checkmate",
                    chess.isGameOver(),
                    chess.isCheckmate()
                );

                if (chess.isGameOver()) {
                    // check if move led to "game over"
                    if (chess.isCheckmate()) {
                        // if reason for game over is a checkmate
                        // Set message to checkmate.
                        setOver(
                            `Checkmate! ${
                                chess.turn() === "w" ? "black" : "white"
                            } wins!`
                        );
                        setShowModal(true);
                        // The winner is determined by checking which side made the last move
                    } else if (chess.isDraw()) {
                        // if it is a draw
                        setOver("Draw"); // set message to "Draw"
                        setShowModal(true);
                    } else {
                        setOver("Game over");
                        setShowModal(true);
                    }
                }

                return result;
            } catch (e) {
                return null;
            } // null if the move was illegal, the move object if the move was legal
        },
        [chess]
    );

    // onDrop function
    const onDrop = (sourceSquare, targetSquare, piece) => {
        // orientation is either 'white' or 'black'. game.turn() returns 'w' or 'b'
        if (chess.turn() !== orientation[0]) return false; // <- 1 prohibit player from moving piece of other player

        if (players.length < 2) return false; // <- 2 disallow a move if the opponent has not joined

        const moveData = {
            from: sourceSquare,
            to: targetSquare,
            color: chess.turn(),
            promotion: piece[1].toLowerCase() ?? "q",
        };

        const move = makeAMove(moveData);

        // illegal move
        if (move === null) return false;

        socket.emit("move", {
            // <- 3 emit a move event.
            move,
            room,
        }); // this event will be transmitted to the opponent via the server

        return true;
    };

    useEffect(() => {
        socket.on("move", (move) => {
            makeAMove(move);
        });
    }, [makeAMove]);

    useEffect(() => {
        socket.on("playerDisconnected", (player) => {
            setOver(`${player.username} has disconnected`); // set game over
        });
    }, []);

    useEffect(() => {
        socket.on("closeRoom", ({ roomId }) => {
            if (roomId === room) {
                cleanup();
            }
        });
    }, [room, cleanup]);

    // Timer Logic
    useEffect(() => {
        const id = setInterval(() => {
            if (chess.turn() === "w") {
                setWhiteTime((prevTime) => prevTime - 1);
            } else {
                setBlackTime((prevTime) => prevTime - 1);
            }
        }, 1000);

        setIntervalId(id);

        return () => clearInterval(id);
    }, [chess]);

    // Time Over Effect
    useEffect(() => {
        if (whiteTime === 0 || blackTime === 0) {
            clearInterval(intervalId);
            setOver("Time's up!");
        }
    }, [whiteTime, blackTime, intervalId]);

    // Game over Modal
    const handleCloseModal = () => {
        setShowModal(false);
        // Reset game or perform cleanup actions
    };

    return (
        <div className="bg-zinc-800 h-screen w-screen overflow-auto flex ">
            <div className={`board  mx-10 my-10 max-w-[70vh] w-[50vw]`}>
                <div className="flex mb-2">
                    <p className="text-white ">
                        {orientation != "white"
                            ? players[0].username
                            : players[1].username}
                    </p>
                    <p
                        className={`text-white text-end ml-auto mr-1 px-2 ${bgClassBlack}`}
                    >
                        {orientation != "white"
                            ? formatTime(whiteTime)
                            : formatTime(blackTime)}
                    </p>
                </div>
                <Chessboard
                    boardOrientation={orientation}
                    position={fen}
                    onPieceDrop={onDrop}
                    cleanup={cleanup}
                    // boardWidth={400}
                    customBoardStyle={{
                        borderRadius: "4px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                    }}
                    customDarkSquareStyle={{ backgroundColor: "#779952" }}
                    customLightSquareStyle={{ backgroundColor: "#edeed1" }}
                />
                <div className="flex mt-2">
                    <p className="text-white ">
                        {orientation === "white"
                            ? players[0].username
                            : players[1].username}
                    </p>
                    <p
                        className={`text-white text-end ml-auto mr-1 px-2  ${bgClass}`}
                    >
                        {orientation === "white"
                            ? formatTime(whiteTime)
                            : formatTime(blackTime)}
                    </p>
                </div>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>{over}</p>
                        <button onClick={handleCloseModal}>Restart</button>
                        <button onClick={cleanup}>Close</button>
                    </div>
                </div>
            )}
            <button
                onClick={() => {
                    socket.emit("closeRoom", { roomId: room });
                    cleanup();
                }}
            >
                Close
            </button>
        </div>
    );
}
