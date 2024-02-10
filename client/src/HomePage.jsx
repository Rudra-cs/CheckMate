import { useState } from "react";

const HomePage = () => {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };
    return (
        <div className="flex flex-col items-center bg-zinc-800 h-screen w-screen">
            <img
                className="h-[300px] w-[300px] lg:h-[350px] lg:w-[350px] mt-[20vh]"
                src="/chessboard.png"
                alt="chessboard"
            />
            <p className="font-semibold text-white font-poppins tracking-wider text-2xl mt-2">
                Classic Chess
            </p>
            <p className=" text-white font-sans  text-xl mt-10">
                Create a room to play with your friend.
            </p>
            <input
                type="text"
                placeholder={"username"}
                value={inputValue}
                onChange={handleChange}
                className="w-[300px] mt-5 px-4 py-2 rounded-md border border-gray-300 focus:outline-none "
            />
            <button className="bg-lime-700 hover:bg-lime-800  tracking-wider font-sans text-lime-100 font-bold py-2 rounded-md mt-2 w-[300px]">
                Create Room
            </button>
        </div>
    );
};

export default HomePage;
