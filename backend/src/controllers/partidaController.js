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

            return res
                .status(500)
                .json({
                    erro:
                        "Erro ao criar partida"
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

            return res.json(
                partidas
            );

        } catch (erro) {

            console.error(erro);

            return res
                .status(500)
                .json({
                    erro:
                        "Erro ao listar partidas"
                });

        }

    }

    static async buscarPorId(
        req,
        res
    ) {

        try {

            const partida =
                await Partida.buscarPorId(
                    req.params.id
                );

            return res.json(
                partida
            );

        } catch (erro) {

            console.error(erro);

            return res
                .status(500)
                .json({
                    erro:
                        "Erro ao buscar partida"
                });

        }

    }

}

module.exports =
    PartidaController;