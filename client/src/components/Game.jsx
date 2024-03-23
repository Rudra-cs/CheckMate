/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import socket from "../connection/Socket";
// import { formatTime } from "../utils/time";
import Chat from "./Chat";

export function Game({ players, room, orientation, cleanup }) {
    const chess = useMemo(() => new Chess(), []);
    const [fen, setFen] = useState(chess.fen());
    const [over, setOver] = useState("");
    // const [whiteTime, setWhiteTime] = useState(180);
    // const [blackTime, setBlackTime] = useState(180);
    // const [intervalId, setIntervalId] = useState(null);

    // const isPlayer1 = players[0].id === socket.id;
    // let gameHasStarted = false;

    // const isWhiteTurn = chess.turn() === "w";
    // const bgClass =
    //     isWhiteTurn === (orientation === "white") ? "bg-gray-500" : "bg-black";
    // const bgClassBlack =
    //     isWhiteTurn === (orientation === "black") ? "bg-gray-500" : "bg-black";

    // const handleStartGame = () => {
    //     if (!isPlayer1 || gameHasStarted) return;
    //     gameHasStarted = true;
    // };

    // useEffect(() => {
    //     // Start the game when gameHasStarted becomes true
    //     if (gameHasStarted) {
    //         const id = setInterval(() => {
    //             // Timer logic...
    //             if (chess.turn() === "w") {
    //                 setWhiteTime((prevTime) => Math.max(prevTime - 1, 0));
    //             } else {
    //                 setBlackTime((prevTime) => Math.max(prevTime - 1, 0));
    //             }
    //         }, 1000);

    //         setIntervalId(id);
    //     }

    //     // Clean up function
    //     return () => {
    //         clearInterval(intervalId);
    //     };
    // }, [chess, gameHasStarted, intervalId]);

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
                        // The winner is determined by checking which side made the last move
                    } else if (chess.isDraw()) {
                        // if it is a draw
                        setOver("Draw"); // set message to "Draw"
                    } else {
                        setOver("Game over");
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

        socket.emit("move", { move, room });

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

    return (
        <div className="bg-zinc-800 h-screen w-screen overflow-auto flex flex-wrap">
            <div className={`board  mx-10 my-10 max-w-[70vh] w-[50vw]`}>
                <div className="flex mb-2">
                    <p className={`text-white`}>
                        {orientation != "white"
                            ? players[0].username
                            : players[1].username}
                    </p>
                    {/* <p
                        className={`text-white text-end ml-auto mr-1 px-2 py-1 w-[60px] ${bgClassBlack}`}
                    >
                        {orientation !== "white"
                            ? formatTime(whiteTime)
                            : formatTime(blackTime)}
                    </p> */}
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
                    {/* <p
                        className={`text-white text-end ml-auto mr-1 px-2  ${bgClass}`}
                    >
                        {orientation === "white"
                            ? formatTime(whiteTime)
                            : formatTime(blackTime)}
                    </p> */}
                </div>
                {/* {isPlayer1 && !gameHasStarted && (
                    <button
                        onClick={handleStartGame}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2 mb-5 w-[300px]"
                    >
                        Start Game
                    </button>
                )} */}
                {/* {orientation === "white" ? (
                    <button
                        // onClick={handleClick}
                        className="bg-lime-100 select-none hover:bg-lime-200 tracking-wider font-sans text-lime-700 font-bold py-2 rounded-md mt-2 mb-5 w-[300px]"
                    >
                        Reset
                    </button>
                ) : (
                    ""
                )} */}
                {over}
            </div>
            <Chat />
        </div>
    );
}
