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

    static async atualizar(
    id,
    nome,
    numero,
    equipeId
) {

    const resultado =
        await pool.query(
            `
            UPDATE jogadores
            SET
                nome = $1,
                numero = $2,
                equipe_id = $3
            WHERE id = $4
            RETURNING *
            `,
            [
                nome,
                numero,
                equipeId,
                id
            ]
        );

    return resultado.rows[0];

}



static async excluir(id) {
const possuiGols =
    await pool.query(
        `
        SELECT id
        FROM gols
        WHERE jogador_id = $1
        LIMIT 1
        `,
        [id]
    );

if (
    possuiGols.rows.length > 0
) {

    throw new Error(
        "Jogador possui gols registrados"
    );

}
    await pool.query(
        `
        DELETE FROM jogadores
        WHERE id = $1
        `,
        [id]
    );

}

}

module.exports = Jogador;