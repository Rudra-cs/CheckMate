// import { useState } from "react";
// import CustomDialog from "./components/DialogBox";
// import socket from "./connection/Socket";
import { Game } from "./Game";
// import CustomTextField from "./components/CustomTextField";

export default function Home() {
    // const [username, setUsername] = useState("");

    // indicates if a username has been submitted
    // const [usernameSubmitted, setUsernameSubmitted] = useState(false);

    return (
        <div>
            {/* <CustomDialog
                open={!usernameSubmitted} // leave open if username has not been selected
                title="Pick a username" // Title of dialog
                contentText="Please select a username" // content text of dialog
                handleContinue={() => {
                    // fired when continue is clicked
                    if (!username) return; // if username hasn't been entered, do nothing
                    socket.emit("username", username); // emit a websocket event called "username" with the username as data
                    console.log(socket.emit("username", username));
                    setUsernameSubmitted(true); // indicate that username has been submitted
                }}
            >
                <CustomTextField // Input
                    autoFocus // automatically set focus on input (make it active).
                    margin="dense"
                    id="username"
                    label="Username"
                    name="username"
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)} // update username state with value
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </CustomDialog> */}
            <Game />
        </div>
    );
}
