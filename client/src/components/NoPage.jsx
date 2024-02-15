import { useState } from "react";

const NoPage = () => {
    // Array of quotes
    const quotes = [
        "The beauty of a move lies not in its appearance but in the thought behind it. - Mikhail Tal",
        "Chess is the gymnasium of the mind. - Blaise Pascal",
        "Every chess master was once a beginner. - Irving Chernev",
        "Chess is the struggle against the error. - Johannes Zukertort",
        "I don’t believe in psychology. I believe in good moves. - Bobby Fischer",
        // Add more quotes as needed
    ];

    // State to store the randomly selected quote
    const [randomQuote, setRandomQuote] = useState("");

    // Function to select a random quote
    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setRandomQuote(quotes[randomIndex]);
    };

    // Call getRandomQuote when component mounts to display initial quote
    useState(() => {
        getRandomQuote();
    }, []);

    return (
        <div>
            <div className="flex flex-col items-center bg-zinc-800 h-screen w-screen overflow-auto">
                <p className="font-semibold text-white font-poppins tracking-wider text-md mx-5 mt-[40vh] select-none">
                    {randomQuote}
                </p>
                <p className=" text-white font-bold font-mono  text-xl mt-10 select-none">
                    Error 404. No Page Found.
                </p>
            </div>
        </div>
    );
};

export default NoPage;
