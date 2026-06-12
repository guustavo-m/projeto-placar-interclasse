const pool = require("../config/db");

class Jogador {

    static async criar(
        nome,
        numero,
        equipeId
    ) {

        const resultado =
            await pool.query(
                `
                INSERT INTO jogadores
                (
                    nome,
                    numero,
                    equipe_id
                )
                VALUES
                (
                    $1,
                    $2,
                    $3
                )
                RETURNING *
                `,
                [
                    nome,
                    numero,
                    equipeId
                ]
            );

        return resultado.rows[0];

    }

    static async listar() {

        const resultado =
            await pool.query(
                `
                SELECT
                    j.*,
                    e.nome AS equipe
                FROM jogadores j
                INNER JOIN equipes e
                    ON e.id = j.equipe_id
                ORDER BY j.nome
                `
            );

        return resultado.rows;

    }

    static async buscarPorId(id) {

        const resultado =
            await pool.query(
                `
                SELECT *
                FROM jogadores
                WHERE id = $1
                `,
                [id]
            );

        return resultado.rows[0];

    }

    static async buscarPorEquipe(
        equipeId
    ) {

        const resultado =
            await pool.query(
                `
                SELECT *
                FROM jogadores
                WHERE equipe_id = $1
                ORDER BY numero
                `,
                [equipeId]
            );

        return resultado.rows;

    }

}

module.exports = Jogador;