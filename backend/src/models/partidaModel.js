const pool = require("../config/db");

class Partida {

    static async criar(
        modalidadeId,
        equipeA,
        equipeB,
        tempoInicial
    ) {

        const resultado =
            await pool.query(
                `
                INSERT INTO partidas
                (
                    modalidade_id,
                    equipe_a,
                    equipe_b,
                    tempo_inicial,
                    tempo_restante
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $4
                )
                RETURNING *
                `,
                [
                    modalidadeId,
                    equipeA,
                    equipeB,
                    tempoInicial
                ]
            );

        return resultado.rows[0];

    }

    static async buscarPorId(id) {

        const resultado =
            await pool.query(
                `
                SELECT
                    p.*,

                    ea.nome AS nome_time_a,
                    eb.nome AS nome_time_b,

                    ea.cor AS cor_time_a,
                    eb.cor AS cor_time_b,

                    ea.bandeira AS bandeira_a,
                    eb.bandeira AS bandeira_b

                FROM partidas p

                INNER JOIN equipes ea
                    ON ea.id = p.equipe_a

                INNER JOIN equipes eb
                    ON eb.id = p.equipe_b

                WHERE p.id = $1
                `,
                [id]
            );

        return resultado.rows[0];

    }

    static async listar() {

        const resultado =
            await pool.query(
                `
                SELECT *
                FROM partidas
                ORDER BY criada_em DESC
                `
            );

        return resultado.rows;

    }

    static async adicionarGol(
    partidaId,
    lado
) {

    const campo =
        lado === "A"
            ? "placar_a"
            : "placar_b";

    await pool.query(
        `
        UPDATE partidas
        SET ${campo} = ${campo} + 1
        WHERE id = $1
        `,
        [partidaId]
    );

}

static async removerGol(
    partidaId,
    lado
) {

    const coluna =
        lado === "A"
            ? "placar_a"
            : "placar_b";

    const resultado =
        await pool.query(
            `
            UPDATE partidas
            SET ${coluna} =
                GREATEST(
                    ${coluna} - 1,
                    0
                )
            WHERE id = $1
            RETURNING *
            `,
            [partidaId]
        );

    return resultado.rows[0];

}

    static async buscarCompleta(id) {

    const resultado =
        await pool.query(
            `
            SELECT *
            FROM partidas
            WHERE id = $1
            `,
            [id]
        );

    return resultado.rows[0];

}

}

module.exports = Partida;