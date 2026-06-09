import { BrowserRouter, Routes, Route } from "react-router-dom";

import Scoreboard from "./pages/ScoreBoard/Scoreboard";
import ControlPannel from "./pages/ControlPannel/ControlPannel";
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
                    element={<ControlPannel />}
                />

            </Routes>

        </BrowserRouter>
    );

}

export default App;