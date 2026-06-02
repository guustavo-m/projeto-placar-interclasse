const partida = require("../data/partida");

let intervalo = null;

exports.obterPartida = (req, res) => {
    res.json(partida);
};

exports.definirTimes = (req, res) => {
    const { timeA, timeB } = req.body;

    partida.timeA = timeA;
    partida.timeB = timeB;

    partida.placarA = 0;
    partida.placarB = 0;

    partida.faltasA = 0;
    partida.faltasB = 0;

    res.json(partida);
};

exports.adicionarGol = (req, res) => {
    const { lado } = req.params;

    if (lado === "A") partida.placarA++;
    if (lado === "B") partida.placarB++;

    res.json(partida);
};

exports.removerGol = (req, res) => {
    const { lado } = req.params;

    if (lado === "A" && partida.placarA > 0)
        partida.placarA--;

    if (lado === "B" && partida.placarB > 0)
        partida.placarB--;

    res.json(partida);
};

exports.adicionarFalta = (req, res) => {
    const { lado } = req.params;

    if (lado === "A") partida.faltasA++;
    if (lado === "B") partida.faltasB++;

    res.json(partida);
};

exports.removerFalta = (req, res) => {
    const { lado } = req.params;

    if (lado === "A" && partida.faltasA > 0)
        partida.faltasA--;

    if (lado === "B" && partida.faltasB > 0)
        partida.faltasB--;

    res.json(partida);
};

exports.editarTempo = (req, res) => {
    const { tempo } = req.body;

    partida.tempo = tempo;

    res.json(partida);
};

exports.iniciarCronometro = (req, res) => {

    if (partida.emAndamento)
        return res.json({ mensagem: "Cronômetro já iniciado" });

    partida.emAndamento = true;

    intervalo = setInterval(() => {

        if (partida.tempo > 0) {
            partida.tempo--;
        } else {
            clearInterval(intervalo);
            partida.emAndamento = false;
        }

    }, 1000);

    res.json(partida);
};

exports.pararCronometro = (req, res) => {

    clearInterval(intervalo);

    partida.emAndamento = false;

    res.json(partida);
};

exports.reiniciarCronometro = (req, res) => {

    clearInterval(intervalo);

    partida.tempo = 600;
    partida.emAndamento = false;

    res.json(partida);
};