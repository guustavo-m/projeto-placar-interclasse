const Gol =
    require("../models/golModel");

const Partida =
    require("../models/partidaModel");

class GolController {

    static async criar(
        req,
        res
    ) {

        console.log("BODY:", req.body);
        console.log(req.body);

        try {

            const {

                partida_id,
                jogador_id,
                equipe_id,
                lado,
                minuto

            } = req.body;

            console.log({
                partida_id,
                jogador_id,
                equipe_id,
                lado,
                minuto
            });

console.log("ANTES DO MODEL");

const gol =
    await Gol.criar(
        partida_id,
        jogador_id,
        equipe_id,
        lado,
        minuto
    );

console.log("DEPOIS DO MODEL");


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

                console.log(partidaAtualizada);

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
                await Partida.buscarPorId(
                    gol.partida_id
                );

            let lado;

            if (
                Number(gol.equipe_id) ===
                Number(partida.equipe_a)
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

                console.log(partidaAtualizada);

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