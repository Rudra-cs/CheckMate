import HomePage from "./components/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Game } from "./components/Game";
const App = () => {
    return (
        <RecoilRoot>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/game/:roomId" element={<Game />} />
                    <Route path="/:roomId" element={<HomePage />} />
                    {/* <Route path="*" element={<NoPage />} /> */}
                </Routes>
            </Router>
        </RecoilRoot>
    );
};

export default App;
