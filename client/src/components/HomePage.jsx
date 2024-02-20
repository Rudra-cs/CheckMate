import { useState } from "react";
import { useRecoilState } from "recoil";
import { orientationState, usernameStore } from "../store/chess";
import { Link, useNavigate } from "react-router-dom";
import socket from "../connection/Socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [username, setUsername] = useRecoilState(usernameStore);
    const [orientation, setOrientation] = useRecoilState(orientationState);

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

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
            <p className=" text-white font-sans  text-xl mt-10 select-none">
                Create a room to play with your friend.
            </p>
            <input
                type="text"
                placeholder={"username"}
                value={inputValue}
                onChange={handleChange}
                className="w-[300px] mt-5 px-4 py-2 rounded-md border border-gray-300 focus:outline-none "
            />
            <button
                onClick={() => {
                    if (inputValue.trim() != "") {
                        setUsername(inputValue.trim());
                        socket.emit("username", inputValue.trim());
                        console.log(username + " " + orientation);
                        socket.emit("createRoom", (r) => {
                            console.log("room - > " + r);
                            navigate(`/game/${r}`);
                            setOrientation("white");
                        });
                    }
                }}
                className="bg-lime-700 select-none hover:bg-lime-800 tracking-wider font-sans text-lime-100 font-bold mb-2 py-2 rounded-md mt-2 w-[300px]"
            >
                Create Private Room
            </button>
            <button
                onClick={() => {
                    if (inputValue.trim() != "") {
                        setUsername(inputValue.trim());
                    } else {
                        toast("Please input username!!");
                    }
                }}
                className="bg-lime-700 select-none hover:bg-lime-800 tracking-wider font-sans text-lime-100 font-bold mb-10 py-2 rounded-md w-[300px]"
            >
                Play Vs Computer
            </button>
            <div className="text-lime-100">
                Made with <span className="text-red-500">❤</span> By{" "}
                <Link
                    className="text-lime-300 hover:underline"
                    to="https://www.linkedin.com/in/rudrabehera"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Rudra Behera.
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
