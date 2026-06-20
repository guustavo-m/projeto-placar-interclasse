const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");

async function login(req, res) {

    const {
        email,
        senha
    } = req.body;

    try {

        const usuario =
            await db.query(
                `
                SELECT *
                FROM usuarios
                WHERE email = $1
                `,
                [email]
            );

        if (
            usuario.rows.length === 0
        ) {

            return res
                .status(401)
                .json({
                    erro: "Usuário não encontrado"
                });

        }

        const dadosUsuario =
            usuario.rows[0];

        const senhaValida =
            await bcrypt.compare(
                senha,
                dadosUsuario.senha
            );

        if (!senhaValida) {

            return res
                .status(401)
                .json({
                    erro: "Senha inválida"
                });

        }

        const token =
            jwt.sign(
                {
                    id: dadosUsuario.id,
                    nome: dadosUsuario.nome,
                    tipo: dadosUsuario.tipo
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "12h"
                }
            );

        res.json({
            token,
            usuario: {
                id: dadosUsuario.id,
                nome: dadosUsuario.nome,
                tipo: dadosUsuario.tipo
            }
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro interno"
        });

    }

}

module.exports = {
    login
};