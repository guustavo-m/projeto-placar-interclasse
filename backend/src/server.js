require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const Partida = require("./models/partidaModel");
const http = require("http");
const { Server } = require("socket.io");

// Routes
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const equipeRoutes = require("./routes/equipeRoutes");
const jogadorRoutes = require("./routes/jogadorRoutes");
const partidaRoutes = require("./routes/partidaRoutes");
const golRoutes = require("./routes/golRoutes");
const authRoutes = require("./routes/authRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const pontosVolei = require("./routes/pontoVoleiRoutes");

const verificarToken = require("../src/middleware/authMiddleware");

const app = express();
const server = http.createServer(app);

// ===============================
// 🔥 ORIGENS PERMITIDAS (ROBUSTO)
// ===============================
const allowedOrigins = process.env.FRONTEND_URL
    ? [
        "http://localhost:5173",
        process.env.FRONTEND_URL
      ]
    : ["http://localhost:5173"];

// ===============================
// 🔥 CORS GLOBAL (EXPRESS)
// ===============================
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true
    })
);

app.use(express.json());

// ===============================
// 🔥 SOCKET.IO (PRODUÇÃO)
// ===============================
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true
    },
    transports: ["polling", "websocket"],
    allowEIO3: true
});

app.set("io", io);

// ===============================
// 🔥 ROTAS
// ===============================
app.use("/auth", authRoutes);

app.use("/modalidades", verificarToken, modalidadeRoutes);
app.use("/equipes", verificarToken, equipeRoutes);
app.use("/jogadores", verificarToken, jogadorRoutes);
app.use("/pontos-volei", verificarToken, pontosVolei);
app.use("/partidas", verificarToken, partidaRoutes);
app.use("/usuarios", verificarToken, usuarioRoutes);
app.use("/gols", verificarToken, golRoutes);

// ===============================
// 🔥 SOCKET EVENTS
// ===============================
io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Cliente saiu: ${socket.id}`);
    });
});

// ===============================
// 🔥 CRONÔMETRO (MATCH TIMER)
// ===============================
setInterval(async () => {
    try {
        const resultado = await pool.query(`
            SELECT id
            FROM partidas
            WHERE em_andamento = true
        `);

        for (const partida of resultado.rows) {
            await pool.query(`
                UPDATE partidas
                SET
                    tempo_restante =
                        GREATEST(tempo_restante - 1, 0),
                    em_andamento =
                        CASE
                            WHEN tempo_restante <= 1
                            THEN false
                            ELSE true
                        END
                WHERE id = $1
            `, [partida.id]);

            const atualizada = await Partida.buscarCompleta(partida.id);

            io.emit("partidaAtualizada", atualizada);
        }
    } catch (erro) {
        console.error("Erro no cronômetro:", erro);
    }
}, 1000);

// ===============================
// 🔥 LOGS DE PRODUÇÃO
// ===============================
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL existe?", !!process.env.DATABASE_URL);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

// ===============================
// 🔥 START SERVER
// ===============================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});