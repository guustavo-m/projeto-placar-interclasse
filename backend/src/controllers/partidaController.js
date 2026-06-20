const Partida =
    require("../models/partidaModel");

class PartidaController {

    static async criar(
        req,
        res
    ) {

        try {

            const {
                modalidade_id,
                equipe_a,
                equipe_b,
                tempo_inicial
            } = req.body;

            const partida =
                await Partida.criar(
                    modalidade_id,
                    equipe_a,
                    equipe_b,
                    tempo_inicial
                );

            return res
                .status(201)
                .json(partida);

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro: "Erro ao criar partida"
            });

        }

    }

    static async listar(
        req,
        res
    ) {

        try {

            const partidas =
                await Partida.listar();

            return res.json(partidas);

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro: "Erro ao listar partidas"
            });

        }

    }

    static async buscarPorId(
        req,
        res
    ) {

        try {

            const partida =
                await Partida.buscarCompleta(
                    req.params.id
                );

            return res.json(partida);

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro: "Erro ao buscar partida"
            });

        }

    }

static async buscarAtual(
    req,
    res
) {

    try {

        const partidas =
            await Partida.listar();

        if (
            partidas.length === 0
        ) {

            return res
                .status(404)
                .json({
                    erro:
                    "Nenhuma partida encontrada"
                });

        }

        const partidaCompleta =
            await Partida.buscarCompleta(
                partidas[0].id
            );

        return res.json(
            partidaCompleta
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
            "Erro ao buscar partida atual"
        });

    }

}

    static async adicionarGol(
        req,
        res
    ) {

        try {

            const {
                id,
                lado
            } = req.params;

            await Partida.adicionarGol(
                id,
                lado
            );

            const partida =
                await Partida.buscarCompleta(
                    id
                );

            const io =
                req.app.get("io");

            io.emit(
                "partidaAtualizada",
                partida
            );

            return res.json(partida);

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro: "Erro ao adicionar gol"
            });

        }

    }

    static async removerGol(
        req,
        res
    ) {

        try {

            const {
                id,
                lado
            } = req.params;

            await Partida.removerGol(
                id,
                lado
            );

            const partida =
                await Partida.buscarCompleta(
                    id
                );

            const io =
                req.app.get("io");

            io.emit(
                "partidaAtualizada",
                partida
            );

            return res.json(partida);

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro: "Erro ao remover gol"
            });

        }

    }

    static async adicionarFalta(
    req,
    res
) {

    try {

        const lado =
            req.params.lado;

        const partida =
            await Partida.listar();

        const partidaAtual =
            partida[0];

        await Partida.adicionarFalta(
            partidaAtual.id,
            lado
        );

        const atualizada =
            await Partida.buscarCompleta(
                partidaAtual.id
            );

        req.app
            .get("io")
            .emit(
                "partidaAtualizada",
                atualizada
            );

        return res.json(
            atualizada
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
                "Erro ao adicionar falta"
        });

    }

}

static async removerFalta(
    req,
    res
) {

    try {

        const lado =
            req.params.lado;

        const partida =
            await Partida.listar();

        const partidaAtual =
            partida[0];

        await Partida.removerFalta(
            partidaAtual.id,
            lado
        );

        const atualizada =
            await Partida.buscarCompleta(
                partidaAtual.id
            );

        req.app
            .get("io")
            .emit(
                "partidaAtualizada",
                atualizada
            );

        return res.json(
            atualizada
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
                "Erro ao remover falta"
        });

    }

}

static async iniciarCronometro(
    req,
    res
) {
  console.log("INICIAR CRONÔMETRO");
    try {

        const { id } =
            req.params;

await Partida.iniciarCronometro(id);

const atualizada =
    await Partida.buscarCompleta(id);

        req.app
            .get("io")
            .emit(
                "partidaAtualizada",
                atualizada
            );

        return res.json(
            atualizada
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
                "Erro ao iniciar cronômetro"
        });

    }

}

static async pararCronometro(
    req,
    res
) {

    try {

const { id } =
    req.params;

await Partida.pararCronometro(id);

const atualizada =
    await Partida.buscarCompleta(id);

        req.app
            .get("io")
            .emit(
                "partidaAtualizada",
                atualizada
            );

        return res.json(
            atualizada
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
                "Erro ao parar cronômetro"
        });

    }

}

static async resetarCronometro(
    req,
    res
) {

    try {

const { id } =
    req.params;

await Partida.resetarCronometro(id);

const atualizada =
    await Partida.buscarCompleta(id);

        req.app
            .get("io")
            .emit(
                "partidaAtualizada",
                atualizada
            );

        return res.json(
            atualizada
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
                "Erro ao resetar cronômetro"
        });

    }

}

static async alterarTempo(
    req,
    res
) {

    const { id } =
        req.params;

    const {
        tempo_restante
    } = req.body;

    await Partida.alterarTempo(
        id,
        tempo_restante
    );

    const partida =
        await Partida.buscarCompleta(id);

    req.app
        .get("io")
        .emit(
            "partidaAtualizada",
            partida
        );

    return res.json(partida);

}

static async finalizarPartida(req, res) {

    const { id } = req.params;

    await Partida.finalizarPartida(id);

    const partida =
        await Partida.buscarCompleta(id);

    req.app
        .get("io")
        .emit(
            "partidaAtualizada",
            partida
        );

    return res.json(partida);
}

static async retomarPartida(req, res) {

    const { id } = req.params;

    await Partida.retomarPartida(id);

    const partida =
        await Partida.buscarCompleta(id);

    req.app
        .get("io")
        .emit(
            "partidaAtualizada",
            partida
        );

    return res.json(partida);
}

static async adicionarSet(
    req,
    res
) {

    try {

        const {
            id,
            lado
        } = req.params;

        await Partida.adicionarSet(
            id,
            lado
        );

        const partida =
            await Partida.buscarCompleta(
                id
            );

        req.app
            .get("io")
            .emit(
                "partidaAtualizada",
                partida
            );

        return res.json(
            partida
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
                "Erro ao adicionar set"
        });

    }

}

static async removerSet(
    req,
    res
) {

    try {

        const {
            id,
            lado
        } = req.params;

        await Partida.removerSet(
            id,
            lado
        );

        const partida =
            await Partida.buscarCompleta(
                id
            );

        req.app
            .get("io")
            .emit(
                "partidaAtualizada",
                partida
            );

        return res.json(
            partida
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
                "Erro ao remover set"
        });

    }

}

static async adicionarPonto(
    req,
    res
) {

    const {
        id,
        lado
    } = req.params;

    await Partida.adicionarPonto(
        id,
        lado
    );

    const partida =
        await Partida.buscarCompleta(
            id
        );

    req.app
        .get("io")
        .emit(
            "partidaAtualizada",
            partida
        );

    return res.json(
        partida
    );

}

static async removerPonto(
    req,
    res
) {

    const {
        id,
        lado
    } = req.params;

    await Partida.removerPonto(
        id,
        lado
    );

    const partida =
        await Partida.buscarCompleta(
            id
        );

    req.app
        .get("io")
        .emit(
            "partidaAtualizada",
            partida
        );

    return res.json(
        partida
    );

}

}

module.exports =
    PartidaController;