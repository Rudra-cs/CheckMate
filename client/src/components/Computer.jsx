import { useState, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Engine } from "../utils/Engine";
const Computer = () => {
    const levels = {
        "Easy 🤓": 2,
        "Medium 🧐": 8,
        "Hard 😵": 14,
    };
    const engine = useMemo(() => new Engine(), []);
    const game = useMemo(() => new Chess(), []);

    const [gamePosition, setGamePosition] = useState(game.fen());
    const [stockfishLevel, setStockfishLevel] = useState(2);

    function findBestMove() {
        engine.evaluatePosition(game.fen(), stockfishLevel);

        engine.onMessage(({ bestMove }) => {
            if (bestMove) {
                // In latest chess.js versions you can just write ```game.move(bestMove)```
                game.move({
                    from: bestMove.substring(0, 2),
                    to: bestMove.substring(2, 4),
                    promotion: bestMove.substring(4, 5),
                });

                setGamePosition(game.fen());
            }
        });
    }

    function onDrop(sourceSquare, targetSquare, piece) {
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: piece[1].toLowerCase() ?? "q",
        });
        setGamePosition(game.fen());

        // illegal move
        if (move === null) return false;

        // exit if the game is over
        if (game.isGameOver() || game.isDraw()) {
            alert("Game Over!!");
            console.log("Game Over");
            return false;
        }

        findBestMove();

        return true;
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-center mb-1">
                {Object.entries(levels).map(([level, depth]) => (
                    <button
                        className="bg-[#B58863]"
                        key={level}
                        // style={{
                        //     ...buttonStyle,
                        //     backgroundColor:
                        //         depth === stockfishLevel
                        //             ? "#B58863"
                        //             : "#f0d9b5",
                        // }}
                        onClick={() => setStockfishLevel(depth)}
                    >
                        {level}
                    </button>
                ))}
            </div>

            <Chessboard
                id="PlayVsStockfish"
                position={gamePosition}
                onPieceDrop={onDrop}
                boardWidth={400}
                customBoardStyle={{
                    flex: "flex",
                    justifyContent: "center",
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                }}
                customDarkSquareStyle={{ backgroundColor: "#779952" }}
                customLightSquareStyle={{ backgroundColor: "#edeed1" }}
            />

            <div>
                <button
                    // style={buttonStyle}
                    onClick={() => {
                        game.reset();
                        setGamePosition(game.fen());
                    }}
                >
                    New game
                </button>
                <button
                    // style={buttonStyle}
                    onClick={() => {
                        game.undo();
                        game.undo();
                        setGamePosition(game.fen());
                    }}
                >
                    Undo
                </button>
            </div>
        </div>
    );
};

export default Computer;
