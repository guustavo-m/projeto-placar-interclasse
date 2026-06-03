import { BrowserRouter, Routes, Route } from "react-router-dom";

import Scoreboard from "./pages/ScoreBoard/Scoreboard";
import ControlPanel from "./pages/ControlPannel/ControlPanel";
import MatchSetup from "./pages/MatchSetup/MatchSetup";

function App() {

    return (
        <BrowserRouter>

            <Routes>
                <Route
                    path="/"
                    element={<MatchSetup />}
                />

                <Route
                    path="/placar"
                    element={<Scoreboard />}
                />
                
                <Route
                    path="/controle"
                    element={<ControlPanel />}
                />

            </Routes>

        </BrowserRouter>
    );

}

export default App;