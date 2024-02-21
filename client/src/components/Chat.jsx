import { useState, useEffect } from "react";

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!socket) return;

        // Listen for incoming messages
        socket.on("message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Clean up event listener on unmount
        return () => {
            socket.off("message");
        };
    }, [socket]);

    const handleMessageSend = () => {
        if (!messageInput.trim() || !socket) return;

        // Send message to the server
        socket.emit("message", messageInput);

        // Clear message input field
        setMessageInput("");
    };

    return (
        <div className="flex flex-col items-center justify-center ">
            <div className="bg-white p-4 rounded-lg shadow-md w-[40]">
                <div className="h-60 overflow-y-auto">
                    {messages.map((message, index) => (
                        <div key={index} className="mb-2">
                            <span className="font-bold">{message.sender}:</span>{" "}
                            {message.text}
                        </div>
                    ))}
                </div>
                <div className="flex items-center mt-4">
                    <input
                        type="text"
                        className="flex-grow h-10 px-4 border rounded-md mr-2"
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleMessageSend();
                        }}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={handleMessageSend}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
