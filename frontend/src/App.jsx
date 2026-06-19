import { BrowserRouter, Routes, Route } from "react-router-dom";

import Scoreboard from "./pages/Scoreboards/FutsalScoreboard";
import ControlPannel from "./pages/ControlPannel/ControlPannel";
import MatchSetup from "./pages/MatchSetup/MatchSetup";
import FutsalScoreboard from "./pages/Scoreboards/FutsalScoreboard";

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
                    path="/controle/:id"
                    element={<ControlPannel />}
                />

                <Route
                    path="/placar/:id"
                    element={<FutsalScoreboard />}
                />

            </Routes>

        </BrowserRouter>
    );

}

export default App;