import { useCallback, useEffect, useRef, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import socket from "../connection/Socket";
import { useRecoilState } from "recoil";
import { orientationState, usernameStore } from "../store/chess";
import { Game } from "./Game";

const Lobby = () => {
    const inputRef = useRef(null);
    const { roomId } = useParams();
    const [username, setUsername] = useRecoilState(usernameStore);
    const [inputValue, setInputValue] = useState("");
    const [orientation, setOrientation] = useRecoilState(orientationState);
    const [players, setPlayers] = useState([]);
    const [readyForGame, setReadyForGame] = useState(false);

    // Copy text to the clipboard
    const copyToClipboard = () => {
        if (inputRef.current) {
            inputRef.current.select();
            navigator.clipboard
                .writeText(inputRef.current.value)
                .then(() => {
                    toast("Copied to clipboard!");
                })
                .catch((err) => {
                    console.error("Failed to copy to clipboard: ", err);
                });
        }
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleClick = () => {
        if (!roomId || inputValue.trim() === "") return;

        setUsername(inputValue.trim());
        socket.emit("username", inputValue.trim());

        // join a room
        socket.emit("joinRoom", { roomId }, (response) => {
            if (response.error) {
                toast(`${response.message}`);
                console.log(response);
                return;
            }
            setPlayers(response?.players);
            setOrientation("black");
            if (response?.players.length === 2) setReadyForGame(true);
        });
    };

    // resets the states responsible for initializing a game
    const cleanup = useCallback(() => {
        // setRoom("");
        setOrientation("");
        setPlayers([]);
    }, [setOrientation]);

    useEffect(() => {
        socket.on("opponentJoined", (roomData) => {
            console.log("roomData", roomData);
            setPlayers(roomData.players);
            if (roomData.players.length === 2) {
                setReadyForGame(true); // Set readyForGame when opponent joins
            }
        });
    }, []);

    // When Login user comes here to enter his/her name to get into the game
    if (username.trim() === "") {
        return (
            <div className="flex flex-col items-center bg-zinc-800 h-screen w-screen overflow-auto">
                <ToastContainer theme="dark" />
                <img
                    className="h-[300px] w-[300px] lg:h-[350px] lg:w-[350px] mt-[20vh] select-none"
                    src="/chessboard.png"
                    alt="chessboard"
                />
                <p className="font-semibold text-white font-poppins tracking-wider text-2xl mt-2 select-none">
                    Classic Chess
                </p>
                <input
                    type="text"
                    placeholder={"username"}
                    value={inputValue}
                    onChange={handleChange}
                    className="w-[300px] mt-5 px-4 py-2 rounded-md border border-gray-300 focus:outline-none "
                />
                <button
                    onClick={handleClick}
                    className="bg-lime-100 select-none hover:bg-lime-200 tracking-wider font-sans text-lime-700 font-bold py-2 rounded-md mt-2 mb-5 w-[300px]"
                >
                    Join Room
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center bg-zinc-800 h-screen w-screen">
            <ToastContainer theme="dark" />
            {readyForGame ? (
                <Game
                    orientation={orientation}
                    players={players}
                    username={username}
                    cleanup={cleanup}
                    room={roomId}
                />
            ) : (
                <>
                    <p className="font-semibold text-white font-poppins tracking-wider text-2xl mt-[40vh] select-none">
                        Waiting for players to join...
                    </p>
                    <p className="text-white font-mono text-lg mt-2 select-none">
                        Share the link with your friend to join.
                    </p>
                    <div className="flex items-center space-x-2">
                        <input
                            ref={inputRef}
                            className="w-64 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            type="text"
                            value={`http://localhost:5173/game/${roomId}`}
                            readOnly
                        />
                        <button
                            onClick={copyToClipboard}
                            className="bg-lime-700 hover:bg-lime-900 text-lime-100 font-bold py-2 px-4 rounded"
                        >
                            <FaRegCopy className="h-5 w-5 inline-block mr-1" />
                            Copy
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Lobby;
