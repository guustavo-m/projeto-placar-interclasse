import { BrowserRouter, Routes, Route } from "react-router-dom";

import MatchSetup from "./pages/MatchSetup/MatchSetup";
import ControlRouter from './pages/Scoreboards/ControlRouter'
import ScoreboardRouter from './pages/Scoreboards/ScoreboardRouter'
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
                    element={<ScoreboardRouter />}
                />

                <Route
                    path="/controle/:id"
                    element={<ControlRouter />}
                />

            </Routes>

        </BrowserRouter>
    );

}

export default App;