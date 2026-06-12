const Gol =
    require("../models/golModel");

const Partida =
    require("../models/partidaModel");

class GolController {

    static async criar(
        req,
        res
    ) {

        try {

            const {

                partida_id,
                jogador_id,
                equipe_id,
                lado,
                minuto

            } = req.body;

            const gol =
                await Gol.criar(
                    partida_id,
                    jogador_id,
                    equipe_id,
                    minuto
                );

            await Partida.adicionarGol(
                partida_id,
                lado
            );

            const partidaAtualizada =
                await Partida.buscarCompleta(
                    partida_id
                );

            const io =
                req.app.get("io");

            io.emit(
                "partidaAtualizada",
                partidaAtualizada
            );

            return res
                .status(201)
                .json(gol);

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro:
                    "Erro ao registrar gol"
            });

        }

    }

    static async listarPorPartida(
        req,
        res
    ) {

        try {

            const gols =
                await Gol.listarPorPartida(
                    req.params.id
                );

            return res.json(
                gols
            );

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro:
                    "Erro ao listar gols"
            });

        }

    }

static async remover(
    req,
    res
) {

    try {

        const gol =
            await Gol.buscarPorId(
                req.params.id
            );

        if (!gol) {

            return res
                .status(404)
                .json({
                    erro:
                        "Gol não encontrado"
                });

        }

        const partida =
            await Partida.buscarCompleta(
                gol.partida_id
            );

        let lado;

        if (
            gol.equipe_id ===
            partida.equipe_a
        ) {

            lado = "A";

        } else {

            lado = "B";

        }

        await Partida.removerGol(
            gol.partida_id,
            lado
        );

        const golRemovido =
            await Gol.remover(
                req.params.id
            );

        const partidaAtualizada =
            await Partida.buscarCompleta(
                gol.partida_id
            );

        const io =
            req.app.get("io");

        io.emit(
            "partidaAtualizada",
            partidaAtualizada
        );

        return res.json(
            golRemovido
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
                "Erro ao remover gol"
        });

    }

}

}

module.exports =
    GolController;