require("dotenv").config();

const express = require("express");
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");

const modalidadeRoutes =
    require("./routes/modalidadeRoutes");

const equipeRoutes =
    require("./routes/equipeRoutes");

const jogadorRoutes =
    require("./routes/jogadorRoutes");

const partidaRoutes =
    require("./routes/partidaRoutes");

const golRoutes =
    require("./routes/golRoutes");

const app = express();

const server =
    http.createServer(app);

const io =
    new Server(server, {

        cors: {
            origin: "*"
        }

    });

app.set("io", io);

app.use(cors());

app.use(express.json());

app.use(
    "/modalidades",
    modalidadeRoutes
);

app.use(
    "/equipes",
    equipeRoutes
);

app.use(
    "/jogadores",
    jogadorRoutes
);

app.use(
    "/partidas",
    partidaRoutes
);

app.use(
    "/gols",
    golRoutes
);

io.on(
    "connection",
    socket => {

        console.log(
            `Cliente conectado: ${socket.id}`
        );

        socket.on(
            "disconnect",
            () => {

                console.log(
                    `Cliente saiu: ${socket.id}`
                );

            }
        );

    }
);

server.listen(
    process.env.PORT,
    () => {

        console.log(
            `Servidor rodando na porta ${process.env.PORT} http://localhost:${process.env.PORT}`
        );

    }
);