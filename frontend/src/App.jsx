import { BrowserRouter, Routes, Route } from "react-router-dom";

import Scoreboard from "./pages/Scoreboards/FutsalScoreboard";
import ControlPannel from "./pages/ControlPannel/ControlPannel";
import MatchSetup from "./pages/MatchSetup/MatchSetup";
import FutsalScoreboard from "./pages/Scoreboards/FutsalScoreboard";
import Home from "./pages/Home/Home";

function App() {

    return (
        <BrowserRouter>

            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/configurar"
                    element={<MatchSetup />}
                />

                <Route
                    path="/placar/:id"
                    element={<FutsalScoreboard />}
                />

                <Route
                    path="/controle/:id"
                    element={<ControlPannel />}
                />

            </Routes>

        </BrowserRouter>
    );

}

export default App;