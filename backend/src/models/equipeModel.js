const pool = require("../config/db");

class Equipe {

    static async criar(
        nome,
        cor,
        bandeira,
        modalidadeId
    ) {

        const resultado = await pool.query(
            `
            INSERT INTO equipes
            (
                nome,
                cor,
                bandeira,
                modalidade_id
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING *
            `,
            [
                nome,
                cor,
                bandeira,
                modalidadeId
            ]
        );

        return resultado.rows[0];

    }

    static async listar() {

        const resultado = await pool.query(
            `
            SELECT
                e.*,
                m.nome AS modalidade
            FROM equipes e
            INNER JOIN modalidades m
                ON e.modalidade_id = m.id
            ORDER BY e.nome
            `
        );

        return resultado.rows;

    }

    static async buscarPorId(id) {

        const resultado = await pool.query(
            `
            SELECT *
            FROM equipes
            WHERE id = $1
            `,
            [id]
        );

        return resultado.rows[0];

    }

    static async buscarPorModalidade(
        modalidadeId
    ) {

        const resultado = await pool.query(
            `
            SELECT *
            FROM equipes
            WHERE modalidade_id = $1
            ORDER BY nome
            `,
            [modalidadeId]
        );

        return resultado.rows;

    }

}

module.exports = Equipe;