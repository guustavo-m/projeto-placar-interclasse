const Usuario =
    require("../models/usuarioModel");

class UsuarioController {

    static async listar(
        req,
        res
    ) {

        try {

            const usuarios =
                await Usuario.listar();

            return res.json(
                usuarios
            );

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro:
                    "Erro ao listar usuários"
            });

        }

    }

    static async buscarPorId(
        req,
        res
    ) {

        try {

            const usuario =
                await Usuario.buscarPorId(
                    req.params.id
                );

            return res.json(
                usuario
            );

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro:
                    "Erro ao buscar usuário"
            });

        }

    }

    static async criar(
        req,
        res
    ) {

        try {

            const {
                nome,
                email,
                senha,
                tipo
            } = req.body;

            const usuario =
                await Usuario.criar(
                    nome,
                    email,
                    senha,
                    tipo
                );

            return res
                .status(201)
                .json(usuario);

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro:
                    "Erro ao criar usuário"
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
                email,
                tipo
            } = req.body;

            const usuario =
                await Usuario.atualizar(
                    req.params.id,
                    nome,
                    email,
                    tipo
                );

            return res.json(
                usuario
            );

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro:
                    "Erro ao atualizar usuário"
            });

        }

    }

    static async excluir(
        req,
        res
    ) {

        try {

            await Usuario.excluir(
                req.params.id
            );

            return res.json({
                mensagem:
                    "Usuário removido"
            });

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro:
                    "Erro ao excluir usuário"
            });

        }

    }

}

module.exports =
    UsuarioController;