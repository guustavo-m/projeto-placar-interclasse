const Equipe =
    require("../models/equipeModel");

class EquipeController {

    static async criar(req, res) {

        try {

            const {
                nome,
                cor,
                bandeira,
                modalidade_id
            } = req.body;

            const equipe =
                await Equipe.criar(
                    nome,
                    cor,
                    bandeira,
                    modalidade_id
                );

            return res
                .status(201)
                .json(equipe);

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro: "Erro ao criar equipe"
            });

        }

    }

    static async listar(req, res) {

        try {

            const equipes =
                await Equipe.listar();

            return res.json(
                equipes
            );

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro: "Erro ao listar equipes"
            });

        }

    }

    static async buscarPorId(
        req,
        res
    ) {

        try {

            const equipe =
                await Equipe.buscarPorId(
                    req.params.id
                );

            return res.json(
                equipe
            );

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro: "Erro ao buscar equipe"
            });

        }

    }

    static async buscarPorModalidade(
        req,
        res
    ) {

        try {

            const equipes =
                await Equipe.buscarPorModalidade(
                    req.params.id
                );

            return res.json(
                equipes
            );

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro:
                    "Erro ao buscar equipes"
            });

        }

    }

}

module.exports =
    EquipeController;