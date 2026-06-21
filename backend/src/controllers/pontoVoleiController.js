const PontoVolei =
    require(
        "../models/pontoVoleiModel"
    );

class PontoVoleiController {

    static async criar(
        req,
        res
    ) {

        try {

            const {
                partida_id,
                jogador_id,
                equipe_id,
                lado
            } = req.body;

            const ponto =
                await PontoVolei.criar(
                    partida_id,
                    jogador_id,
                    equipe_id,
                    lado
                );

            return res
                .status(201)
                .json(ponto);

        } catch (erro) {

            console.error(erro);

            return res
                .status(500)
                .json({
                    erro:
                        "Erro ao registrar ponto"
                });

        }

    }

    static async listarPorPartida(
        req,
        res
    ) {

        const dados =
            await PontoVolei.listarPorPartida(
                req.params.id
            );

        res.json(dados);

    }

    static async rankingPartida(
        req,
        res
    ) {

        const ranking =
            await PontoVolei.rankingPartida(
                req.params.id
            );

        res.json(ranking);

    }

    static async excluir(
    req,
    res
) {

    try {

        await PontoVolei.excluir(
            req.params.id
        );

        return res.json({
            mensagem:
                "Ponto removido"
        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
                "Erro ao remover ponto"
        });

    }

}

}

module.exports =
    PontoVoleiController;