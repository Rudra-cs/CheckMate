import HomePage from "./components/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Lobby from "./components/Lobby";
import NoPage from "./components/NoPage";
import Computer from "./components/Computer";
const App = () => {
    return (
        <RecoilRoot>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/computer" element={<Computer />} />
                    <Route path="/game/:roomId" element={<Lobby />} />
                    <Route path="/*" element={<NoPage />} />
                </Routes>
            </Router>
        </RecoilRoot>
    );
};

export default App;
