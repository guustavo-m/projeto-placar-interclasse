const pool =
    require("../config/db");

const bcrypt =
    require("bcryptjs");

class Usuario {

    static async listar() {

        const resultado =
            await pool.query(
                `
                SELECT
                    id,
                    nome,
                    email,
                    tipo
                FROM usuarios
                ORDER BY nome
                `
            );

        return resultado.rows;

    }

    static async buscarPorId(id) {

        const resultado =
            await pool.query(
                `
                SELECT
                    id,
                    nome,
                    email,
                    tipo
                FROM usuarios
                WHERE id = $1
                `,
                [id]
            );

        return resultado.rows[0];

    }

    static async criar(
        nome,
        email,
        senha,
        tipo
    ) {

        const hash =
            await bcrypt.hash(
                senha,
                10
            );

        const resultado =
            await pool.query(
                `
                INSERT INTO usuarios
                (
                    nome,
                    email,
                    senha,
                    tipo
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4
                )
                RETURNING
                    id,
                    nome,
                    email,
                    tipo
                `,
                [
                    nome,
                    email,
                    hash,
                    tipo
                ]
            );

        return resultado.rows[0];

    }

    static async atualizar(
        id,
        nome,
        email,
        tipo
    ) {

        const resultado =
            await pool.query(
                `
                UPDATE usuarios
                SET
                    nome = $1,
                    email = $2,
                    tipo = $3
                WHERE id = $4
                RETURNING
                    id,
                    nome,
                    email,
                    tipo
                `,
                [
                    nome,
                    email,
                    tipo,
                    id
                ]
            );

        return resultado.rows[0];

    }

    static async excluir(id) {

        await pool.query(
            `
            DELETE FROM usuarios
            WHERE id = $1
            `,
            [id]
        );

    }

}

module.exports =
    Usuario;