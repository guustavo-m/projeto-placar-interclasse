require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool =
    require("./config/db");

const Partida =
    require("./models/partidaModel");
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

const authRoutes = 
    require("./routes/authRoutes")

const usuarioRoutes =
    require("./routes/usuarioRoutes");

const pontosVolei =
    require("./routes/pontoVoleiRoutes");

const verificarToken =
    require("../src/middleware/authMiddleware");

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
    "/auth",
    authRoutes
);

app.use(
    "/modalidades",
    verificarToken,
    modalidadeRoutes
);

app.use(
    "/equipes",
    verificarToken,
    equipeRoutes
);

app.use(
    "/jogadores",
    verificarToken,
    jogadorRoutes
);

app.use(
    "/pontos-volei",
    verificarToken,
    pontosVolei
);

app.use(
    "/partidas",
    verificarToken,
    partidaRoutes
);

app.use(
    "/usuarios",
    verificarToken,
    usuarioRoutes
);

app.use(
    "/gols",
    verificarToken,
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

setInterval(
    async () => {

        try {

            const resultado =
                await pool.query(
                    `
                    SELECT id
                    FROM partidas
                    WHERE em_andamento = true
                    `
                );

            for (
                const partida of resultado.rows
            ) {

                await pool.query(
                    `
                    UPDATE partidas
                    SET
                        tempo_restante =
                            GREATEST(
                                tempo_restante - 1,
                                0
                            ),
                        em_andamento =
                            CASE
                                WHEN tempo_restante <= 1
                                THEN false
                                ELSE true
                            END
                    WHERE id = $1
                    `,
                    [partida.id]
                );

                const atualizada =
                    await Partida.buscarCompleta(
                        partida.id
                    );

                io.emit(
                    "partidaAtualizada",
                    atualizada
                );

            }

        } catch (erro) {

            console.error(
                "Erro no cronômetro:",
                erro
            );

        }

    },
    1000
);

console.log(
    "NODE_ENV:",
    process.env.NODE_ENV
);

console.log(
    "DATABASE_URL existe?",
    !!process.env.DATABASE_URL
);


server.listen(
    process.env.PORT,
    () => {

        console.log(
            `Servidor rodando na porta ${process.env.PORT} http://localhost:${process.env.PORT}`
        );

    }
);