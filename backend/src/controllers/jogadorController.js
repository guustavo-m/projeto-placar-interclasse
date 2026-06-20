const Jogador =
    require("../models/jogadorModel");

class JogadorController {

    static async criar(
        req,
        res
    ) {

        try {

            const {
                nome,
                numero,
                equipe_id
            } = req.body;

            const jogador =
                await Jogador.criar(
                    nome,
                    numero,
                    equipe_id
                );

            return res
                .status(201)
                .json(jogador);

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro:
                    "Erro ao criar jogador"
            });

        }

    }

    static async listar(
        req,
        res
    ) {

        try {

            const jogadores =
                await Jogador.listar();

            return res.json(
                jogadores
            );

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro:
                    "Erro ao listar jogadores"
            });

        }

    }

    static async buscarPorId(
        req,
        res
    ) {

        try {

            const jogador =
                await Jogador.buscarPorId(
                    req.params.id
                );

            return res.json(
                jogador
            );

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro:
                    "Erro ao buscar jogador"
            });

        }

    }

    static async buscarPorEquipe(
        req,
        res
    ) {

        try {

            const jogadores =
                await Jogador.buscarPorEquipe(
                    req.params.id
                );

            return res.json(
                jogadores
            );

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro:
                    "Erro ao listar equipe"
            });

        }

    }

    static async atualizar(
    req,
    res
) {

    try {

        const {
            nome,
            numero,
            equipe_id
        } = req.body;

        const jogador =
            await Jogador.atualizar(
                req.params.id,
                nome,
                numero,
                equipe_id
            );

        return res.json(
            jogador
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
                "Erro ao atualizar jogador"
        });

    }

}

static async excluir(
    req,
    res
) {

    try {

        await Jogador.excluir(
            req.params.id
        );

        return res.json({
            mensagem:
                "Jogador removido"
        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro:
                "Erro ao excluir jogador"
        });

    }

}

}

module.exports =
    JogadorController;