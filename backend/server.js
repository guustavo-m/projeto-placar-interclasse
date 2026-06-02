const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const partidaRoutes = require("./routes/partidaRoutes");

app.use("/partida", partidaRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});