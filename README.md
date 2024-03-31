# 🚀 CheckMate - Online Chess Game. Play with your friends ♟️

Revolutionize your chess experience online! Our platform boasts WebRTC and Socket.io for seamless matches. Enjoy real-time play, instant updates, and sleek design. Elevate your game now! ♟️🌐

## 📦 Technologies

-   `Vite`
-   `React.js`
-   `Javascript`
-   `Tailwind CSS`
-   `Socket.io`
-   `WebRTC`
-   `Node.js`
-   `React ChessBoard`
-   `chess.js`

## 🦄 Features

Here's what you can do with Checkmate:

-   **Real-time Matches:** Engage in thrilling chess matches with your friends worldwide, powered by WebRTC and Socket.io for seamless gameplay.

-   **Dynamic Chessboard:** Immerse yourself in the game with dynamic chessboard components, offering flexibility and customization to suit your strategy.

-   **Sleek Interface:** Enjoy a polished and responsive design across all devices, ensuring a seamless chess-playing experience.

-   **User-Friendly Gameplay:** Our intuitive interface guides you through the game effortlessly, eliminating the hassle of complex controls.

-   **Live Updates:** Stay on top of the action with real-time updates, witnessing every move unfold dynamically on the board.

-   **Personalized Experience:** Customize your gameplay experience with tailored settings, reflecting your unique style and preferences.

-   **Player VS Computer:** You can choose the difficulty level and play with the stockfish engine.

## 💭 How can it be improved?

-   Introduce multiple board themes to cater to different player preferences and enhance the visual experience.
-   Expand export options beyond standard formats like PGN, including options for exporting to ChessBase or generating shareable game links.
-   Implement interactive analysis tools, such as move annotations, variation trees, or engine analysis, to help players improve their skills and understand their games better.
-   Offer a variety of customizable themes including different board designs, piece sets, and background options to personalize the playing experience.
-   Provide advanced text options for in-game chat, including font customization, color selection, and text size adjustments, to enhance communication between players.

## 🚦 Running the Project

To run the project in your local environment, follow these steps:

1. Clone the repository to your local machine.
2. Run `npm install` or `yarn` in the project directory to install the required dependencies.
3. Run `npm run start` or `yarn start` to get the project started.
4. Open [http://localhost:5173](http://localhost:5173) (or the address shown in your console) in your web browser to view the app.
5. Next go to server folder and do the same for the node server to run.

## 🍿 Photos

![Screenshot]()

## 🧠 Making of Chess Engine

import { Canvas, Meta, Story } from "@storybook/addon-docs";

import { Chessboard } from "../src";

<Meta
  title="GuideBook/Stockfish Integration"
  component={Chessboard}
  parameters={{ previewTabs: { canvas: { hidden: true } } }}
/>

export const Template = (args) => <ComputerVsComputer {...args} />;

# `Stockfish` Integration with `react-chessboard`

> ℹ️ _You can use "Stockfish" with "react-chessboard" to craft chess games against bots, aid players in learning, analyze their matches, or assist in identifying optimal moves.
> Stockfish is a powerful chess engine, considered one of the best in the world. Using a search algorithm and evaluation functions, it plays chess at a high level, and has 3000+ FIDE ELO rating.
> Currently there are two stockfish engine implementations which you can use directly on your browser. [stockfish.wasm](https://github.com/lichess-org/stockfish.wasm) and [stockfish.js](http://github.com/nmrugg/stockfish.js).
> They both are open source and free to use in any project. Although their strength of playing chess are the same, the "stockfish.wasm" is lighter and offers better calculating performance, but it is not compatible with old browsers._

<br />

#### For playing against stockfish using "react-chessboard" you have to do these steps below:

1. ###### Download "stockfish.js" file:

    You can download the "stockfish.js" file directly from [react-chessboard GitHub repository](https://github.com/Clariity/react-chessboard/blob/main/stories/stockfish/stockfish.js). For the latest updates and more info visit https://github.com/nmrugg/stockfish.js

---

2. ###### Place downloaded "stockfish.js" file into your React app's "public" folder:

    Since "stockfish.js" requires substantial calculation resources, it should be run as a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). Placing it in the "public" folder allows it to be used from any point in your React app.

---

3. ###### Run "stockfish.js" as a web worker and it is ready to handle your UCI commands

    Below is a simple usage example of 'stockfish.js':

    ```js
    useEffect(() => {
        const stockfish = new Worker("./stockfish.js");
        const DEPTH = 8; // number of halfmoves the engine looks ahead
        const FEN_POSITION =
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

        stockfish.postMessage("uci");
        stockfish.postMessage(`position fen ${FEN_POSITION}`);
        stockfish.postMessage(`go depth ${DEPTH}`);

        stockfish.onmessage = (e) => {
            console.log(e.data); // in the console output you will see `bestmove e2e4` message
        };
    }, []);
    ```

---

4. ##### Create `Engine` class with stockfish commands you need for easy use

    The more advanced example of `Engine` class you can find [in our GitHub](https://github.com/Clariity/react-chessboard/blob/main/stories/stockfish/engine.ts)

    ```js
    class Engine {
        constructor() {
            this.stockfish = new Worker("./stockfish.js");
            this.onMessage = (callback) => {
                this.stockfish.addEventListener("message", (e) => {
                    const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];

                    callback({ bestMove });
                });
            };
            // Init engine
            this.sendMessage("uci");
            this.sendMessage("isready");
        }

        evaluatePosition(fen, depth) {
            this.stockfish.postMessage(`position fen ${fen}`);
            this.stockfish.postMessage(`go depth ${depth}`);
        }
        stop() {
            this.sendMessage("stop"); // Run when changing positions
        }
        quit() {
            this.sendMessage("quit"); // Good to run this before unmounting.
        }
    }
    ```

---

5.  ##### Ready! You now can use [Engine](https://github.com/Clariity/react-chessboard/blob/main/stories/stockfish/engine.ts) for detecting the best moves on your `react-chessboard`

    The example below will create game where stockfish plays agianst itself

    ```jsx
    export const StockfishVsStockfish = () => {
        const engine = useMemo(() => new Engine(), []);
        const game = useMemo(() => new Chess(), []);
        const [chessBoardPosition, setChessBoardPosition] = useState(
            game.fen()
        );

        function findBestMove() {
            engine.evaluatePosition(game.fen(), 10);
            engine.onMessage(({ bestMove }) => {
                if (bestMove) {
                    game.move({
                        from: bestMove.substring(0, 2),
                        to: bestMove.substring(2, 4),
                        promotion: bestMove.substring(4, 5),
                    });

                    setChessBoardPosition(game.fen());
                }
            });
        }

        useEffect(() => {
            if (!game.game_over() || game.in_draw()) {
                setTimeout(findBestMove, 300);
            }
        }, [chessBoardPosition]);

        return <Chessboard position={chessBoardPosition} />;
    };
    ```

## Create your own turing machine for the chess engine

    - move generation
    - board evaluation
    - mini max
    - alpha beta pruning

### Step 1: Move generation and board visualization

Step 2 : Position evaluation
Step 3: Search tree using Minimax
Step 4: Alpha-beta pruning

pawn - 1
rook - 5
knight -3
bishop - 3.5(3)
queen - 10(9)

check for the move if it captures or makes a checkmate

Considerable move:-

1. Captures
2. Checkmate
