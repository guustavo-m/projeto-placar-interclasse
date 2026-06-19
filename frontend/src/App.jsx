import { BrowserRouter, Routes, Route } from "react-router-dom";

import Scoreboard from "./pages/Scoreboards/FutsalScoreboard";
import ControlPannel from "./pages/ControlPannel/ControlPannel";
import MatchSetup from "./pages/MatchSetup/MatchSetup";
import FutsalScoreboard from "./pages/Scoreboards/FutsalScoreboard";
import VolleyballScoreboard
from "./pages/Scoreboards/VoleiScoreboard";
import VolleyballControlPanel
from "./pages/ControlPannel/VoleiControlPannel";
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
                    path="/volei/:id"
                    element={
                        <VolleyballScoreboard />
                    }
                />

                <Route
                    path="/controle/:id"
                    element={<ControlPannel />}
                />

                <Route
                    path="/controle-volei/:id"
                    element={
                        <VolleyballControlPanel />
                    }
                />

            </Routes>

        </BrowserRouter>
    );

}

export default App;