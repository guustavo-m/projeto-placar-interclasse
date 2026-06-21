import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MatchSetup from "./pages/MatchSetup/MatchSetup";
import ControlRouter from './pages/Scoreboards/ControlRouter'
import ScoreboardRouter from './pages/Scoreboards/ScoreboardRouter'
import Home from "./pages/Home/Home";
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import Login from "./pages/Login/Login";
import PlayerManagement from "./pages/PlayerManager/PlayerManager";
import TeamManagement from "./pages/TeamManager/TeamManager";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import UserManager from "./pages/UserManager/UserManager";

function App() {

    return (
        <BrowserRouter>

            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/configurar"
                    element={
                        <PrivateRoute>
                            <MatchSetup />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/placar/:id"
                    element={
                        <PrivateRoute>
                            <ScoreboardRouter />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/controle/:id"
                    element={
                        <PrivateRoute>
                            <ControlRouter />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/jogadores"
                    element={
                        <PrivateRoute>
                            <AdminRoute>
                                <PlayerManagement />
                            </AdminRoute>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/equipes"
                    element={
                        <PrivateRoute>
                            <AdminRoute>
                                <TeamManagement />
                            </AdminRoute>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/usuarios"
                    element={
                        <PrivateRoute>
                            <AdminRoute>
                                <UserManager />
                            </AdminRoute>
                        </PrivateRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );

}

export default App;