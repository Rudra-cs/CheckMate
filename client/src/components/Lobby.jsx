import { useRef } from "react";
import { FaRegCopy } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Lobby = () => {
    const inputRef = useRef(null);

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
    return (
        <div className="flex flex-col items-center bg-zinc-800 h-screen w-screen">
            <ToastContainer theme="dark" />
            <p className="font-semibold text-white font-poppins tracking-wider text-2xl mt-[40vh] select-none">
                Waiting for players to join...
            </p>
            <p className=" text-white font-mono  text-lg mt-2 select-none">
                Share the link with your friend to join.
            </p>
            <div className="flex items-center space-x-2">
                <input
                    ref={inputRef}
                    className="w-64 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                    type="text"
                    value="link to copy"
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
        </div>
    );
};

export default Lobby;
