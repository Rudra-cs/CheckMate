export class Engine {
    constructor() {
        this.stockfish = new Worker("./stockfish.js");
        this.onMessage = (callback) => {
            this.stockfish.addEventListener("message", (e) => {
                const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];

                callback({ bestMove });
            });

            // // // Init engine
            // this.sendMessage("uci");
            // this.sendMessage("isready");
        };
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

    // sendMessage(message) {
    //     this.stockfish.postMessage(message);
    // }
}
