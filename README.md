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

    <br />

    ## More advanced examples with code you can see below

    ### <center>Play vs computer</center>

    <Canvas>
      <Story id="example-chessboard--play-vs-computer" />
    </Canvas>

    <br /> <br />

    ### <center>Analyse chess game using stockfish</center>

    <Canvas>
      <Story id="example-chessboard--analysis-board" />
    </Canvas>

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
