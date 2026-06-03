const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const partidaRoutes = require("./routes/partidaRoutes");
const socketConfig = require("./socket");
const partida = require("./data/partida");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

socketConfig.init(io);

app.use("/partida", partidaRoutes);

io.on("connection", (socket) => {

    console.log(`Cliente conectado: ${socket.id}`);

    socket.emit("partidaAtualizada", partida);

    socket.on("disconnect", () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});