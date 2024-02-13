import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export function Game({ players, room, orientation, cleanup }) {
    const chess = useMemo(() => new Chess(), []); // <- 1
    const [fen, setFen] = useState(chess.fen()); // <- 2
    const [over, setOver] = useState("");

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
        const moveData = {
            from: sourceSquare,
            to: targetSquare,
            color: chess.turn(),
            promotion: piece[1].toLowerCase() ?? "q",
        };

        const move = makeAMove(moveData);

        // illegal move
        if (move === null) return false;
        return true;
    };

    useEffect(() => {});

    // Game component returned jsx
    return (
        <>
            <div className={`board  mx-10 my-10 max-w-[70vh] w-[70vw]`}>
                {/* Load the chessboard */}
                <Chessboard
                    position={fen}
                    onPieceDrop={onDrop}
                    // boardWidth={400}
                    customBoardStyle={{
                        borderRadius: "4px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                    }}
                    customDarkSquareStyle={{ backgroundColor: "#779952" }}
                    customLightSquareStyle={{ backgroundColor: "#edeed1" }}
                />
            </div>
        </>
    );
}
