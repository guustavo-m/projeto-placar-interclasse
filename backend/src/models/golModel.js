const pool = require("../config/db");

class Gol {

    static async criar(
        partidaId,
        jogadorId,
        lado,
        minuto
    ) {

        const resultado =
            await pool.query(
                `
                INSERT INTO gols
                (
                    partida_id,
                    jogador_id,
                    lado,
                    minuto
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
                    partidaId,
                    jogadorId,
                    lado,
                    minuto
                ]
            );

        return resultado.rows[0];

    }

    static async listarPorPartida(
        partidaId
    ) {

        const resultado =
            await pool.query(
                `
                SELECT

                    g.*,

                    j.nome AS jogador,

                    j.numero,

                    e.nome AS equipe

                FROM gols g

                INNER JOIN jogadores j
                    ON j.id = g.jogador_id

                INNER JOIN equipes e
                    ON e.id = g.equipe_id

                WHERE g.partida_id = $1

                ORDER BY g.minuto
                `,
                [partidaId]
            );

        return resultado.rows;

    }

    static async buscarPorId(id) {

        const resultado =
            await pool.query(
                `
                SELECT *
                FROM gols
                WHERE id = $1
                `,
                [id]
            );

        return resultado.rows[0];

    }

    static async remover(id) {

        const resultado =
            await pool.query(
                `
                DELETE FROM gols
                WHERE id = $1
                RETURNING *
                `,
                [id]
            );

        return resultado.rows[0];

    }

    static async buscarUltimoGolEquipe(
        partidaId,
        equipeId
    ) {

        const resultado =
            await pool.query(
                `
                SELECT *
                FROM gols
                WHERE partida_id = $1
                  AND equipe_id = $2
                ORDER BY id DESC
                LIMIT 1
                `,
                [
                    partidaId,
                    equipeId
                ]
            );

        return resultado.rows[0];

    }

}

module.exports = Gol;