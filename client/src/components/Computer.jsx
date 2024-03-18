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
        <div className="flex flex-col bg-zinc-800 min-h-screen">
            <p className="text-white flex justify-center mt-[5vh] font-mono  tracking-widest text-lg">
                StockFish Level
            </p>
            <div className="flex justify-center mb-5 tracking-wider text-base">
                {Object.entries(levels).map(([level, depth]) => (
                    <button
                        className={` ${
                            depth === stockfishLevel
                                ? "bg-[#f0d9b5]"
                                : "bg-[#B58863]"
                        } p-2`}
                        key={level}
                        onClick={() => setStockfishLevel(depth)}
                    >
                        {level}
                    </button>
                ))}
            </div>

            <div className="flex justify-center items-center">
                <Chessboard
                    id="PlayVsStockfish"
                    position={gamePosition}
                    onPieceDrop={onDrop}
                    boardWidth={400}
                    customBoardStyle={{
                        flex: "flex",
                        borderRadius: "4px",
                        margin: "auto",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                    }}
                    customDarkSquareStyle={{ backgroundColor: "#779952" }}
                    customLightSquareStyle={{ backgroundColor: "#edeed1" }}
                />
            </div>

            <div className="flex justify-center mt-5">
                <button
                    className="bg-lime-700 hover:bg-lime-900 text-lime-100 font-bold py-2 px-4 rounded"
                    onClick={() => {
                        game.reset();
                        setGamePosition(game.fen());
                    }}
                >
                    Reset
                </button>
                <button
                    className="bg-lime-700 hover:bg-lime-900 text-lime-100 font-bold py-2 px-4 rounded ml-2"
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
