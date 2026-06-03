const partida = require("../data/partida");
const { getIo } = require("../socket");

let intervalo = null;

function obterPartidaFormatada() {

    return {
        ...partida,
        tempoFormatado: formatarTempo(partida.tempoRestante)
    };
}

function atualizarClientes() {

    const io = getIo();

    if (io) {
        io.emit(
            "partidaAtualizada",
            obterPartidaFormatada()
        );
    }

}

exports.obterPartida = (req, res) => {
    res.json(
        obterPartidaFormatada()
    );
};

exports.definirTimes = (req, res) => {

    const { timeA, timeB } = req.body;

    partida.timeA = timeA;
    partida.timeB = timeB;

    partida.placarA = 0;
    partida.placarB = 0;

    partida.faltasA = 0;
    partida.faltasB = 0;

    atualizarClientes();

    res.json(partida);
};

exports.adicionarGol = (req, res) => {

    const { lado } = req.params;

    if (lado === "A") {
        partida.placarA++;
    }

    if (lado === "B") {
        partida.placarB++;
    }

    atualizarClientes();

    res.json(partida);
};

exports.removerGol = (req, res) => {

    const { lado } = req.params;

    if (lado === "A" && partida.placarA > 0) {
        partida.placarA--;
    }

    if (lado === "B" && partida.placarB > 0) {
        partida.placarB--;
    }

    atualizarClientes();

    res.json(partida);
};

exports.adicionarFalta = (req, res) => {

    const { lado } = req.params;

    if (lado === "A") {
        partida.faltasA++;
    }

    if (lado === "B") {
        partida.faltasB++;
    }

    atualizarClientes();

    res.json(partida);
};

exports.removerFalta = (req, res) => {

    const { lado } = req.params;

    if (lado === "A" && partida.faltasA > 0) {
        partida.faltasA--;
    }

    if (lado === "B" && partida.faltasB > 0) {
        partida.faltasB--;
    }

    atualizarClientes();

    res.json(partida);
};

function formatarTempo(segundos) {

    const minutos = Math.floor(segundos / 60);

    const segs = segundos % 60;

    return `${String(minutos).padStart(2, "0")}:${String(segs).padStart(2, "0")}`;
}

exports.editarTempo = (req, res) => {

    const { minutos } = req.body;

    partida.tempoRestante = minutos * 60;

    atualizarClientes();

    res.json(
        obterPartidaFormatada()
    );
};

exports.iniciarCronometro = (req, res) => {

    if (partida.emAndamento) {
        return res.status(400).json({
            mensagem: "Cronômetro já está em andamento"
        });
    }

    partida.emAndamento = true;

    atualizarClientes();

    intervalo = setInterval(() => {

        if (partida.tempoRestante > 0) {

            partida.tempoRestante--;

            atualizarClientes();

        } else {

            clearInterval(intervalo);

            partida.emAndamento = false;

            atualizarClientes();

        }

    }, 1000);

    res.json(partida);
};

exports.pararCronometro = (req, res) => {

    clearInterval(intervalo);

    partida.emAndamento = false;

    atualizarClientes();

    res.json(partida);
};

exports.reiniciarCronometro = (req, res) => {

    clearInterval(intervalo);

    partida.tempo = 600;

    partida.emAndamento = false;

    atualizarClientes();

    res.json(partida);
};

exports.resetarPartida = (req, res) => {

    clearInterval(intervalo);

    partida.placarA = 0;
    partida.placarB = 0;

    partida.faltasA = 0;
    partida.faltasB = 0;

    partida.tempo = 600;

    partida.emAndamento = false;

    atualizarClientes();

    res.json(partida);
};