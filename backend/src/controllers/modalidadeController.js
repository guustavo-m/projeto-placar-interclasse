const Modalidade =
    require("../models/modalidadeModel");

class ModalidadeController {

    static async listar(req, res) {

        try {

            const modalidades =
                await Modalidade.listar();

            return res.json(
                modalidades
            );

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro: "Erro ao listar modalidades"
            });

        }

    }

}

module.exports =
    ModalidadeController;