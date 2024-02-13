import { useState } from "react";
import { useRecoilState } from "recoil";
import { usernameStore } from "../store/chess";
import { useNavigate } from "react-router-dom";
import socket from "../connection/Socket";

const HomePage = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [username, setUsername] = useRecoilState(usernameStore);
    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleClick = () => {
        if (inputValue.trim() != "") {
            setUsername(inputValue.trim());
            socket.emit("username", inputValue.trim());
            navigate(`/${inputValue}`);
            console.log(username);
        }
    };
    return (
        <div className="flex flex-col items-center bg-zinc-800 h-screen w-screen overflow-auto">
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
                onClick={handleClick}
                className="bg-lime-700 select-none hover:bg-lime-800 tracking-wider font-sans text-lime-100 font-bold py-2 rounded-md mt-2 w-[300px]"
            >
                Create Room
            </button>
        </div>
    );
};

export default HomePage;
