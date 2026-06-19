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
                    ea.cor AS cor_time_a,
                    ea.bandeira AS bandeira_a,

                    eb.nome AS nome_time_b,
                    eb.cor AS cor_time_b,
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
                SELECT

                    p.*,

                    ea.nome AS nome_time_a,
                    ea.cor AS cor_time_a,
                    ea.bandeira AS bandeira_a,

                    eb.nome AS nome_time_b,
                    eb.cor AS cor_time_b,
                    eb.bandeira AS bandeira_b

                FROM partidas p

                INNER JOIN equipes ea
                    ON ea.id = p.equipe_a

                INNER JOIN equipes eb
                    ON eb.id = p.equipe_b

                ORDER BY p.id DESC
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

    const partidaResult =
        await pool.query(
            `
            SELECT

                p.*,

                ea.nome AS nome_time_a,
                ea.cor AS cor_time_a,
                ea.bandeira AS bandeira_a,

                eb.nome AS nome_time_b,
                eb.cor AS cor_time_b,
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

    if (
        partidaResult.rows.length === 0
    ) {

        return null;

    }

    const partida =
        partidaResult.rows[0];

    const golsResult =
        await pool.query(
            `
            SELECT

                g.id,
                g.minuto,
                g.equipe_id,

                j.nome AS jogador,
                j.numero

            FROM gols g

            INNER JOIN jogadores j
                ON j.id = g.jogador_id

            WHERE g.partida_id = $1

            ORDER BY g.minuto
            `,
            [id]
        );

    partida.gols =
        golsResult.rows;

    return partida;

}

static async adicionarFalta(
    partidaId,
    lado
) {

    const coluna =
        lado === "A"
            ? "faltas_a"
            : "faltas_b";

    const resultado =
        await pool.query(
            `
            UPDATE partidas
            SET ${coluna} = ${coluna} + 1
            WHERE id = $1
            RETURNING *
            `,
            [partidaId]
        );

    return resultado.rows[0];

}

static async removerFalta(
    partidaId,
    lado
) {

    const coluna =
        lado === "A"
            ? "faltas_a"
            : "faltas_b";

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

static async iniciarCronometro(
    partidaId
) {

    const resultado =
        await pool.query(
            `
            UPDATE partidas
            SET em_andamento = true
            WHERE id = $1
            RETURNING *
            `,
            [partidaId]
        );

    return resultado.rows[0];

}

static async pararCronometro(
    partidaId
) {

    const resultado =
        await pool.query(
            `
            UPDATE partidas
            SET em_andamento = false
            WHERE id = $1
            RETURNING *
            `,
            [partidaId]
        );

    return resultado.rows[0];

}

static async resetarCronometro(
    partidaId
) {

    const resultado =
        await pool.query(
            `
            UPDATE partidas
            SET
                tempo_restante =
                    tempo_inicial,
                em_andamento = false
            WHERE id = $1
            RETURNING *
            `,
            [partidaId]
        );

    return resultado.rows[0];

}

static async alterarTempo(
    partidaId,
    tempo
) {

    const resultado =
        await pool.query(
            `
            UPDATE partidas
            SET tempo_restante = $1
            WHERE id = $2
            RETURNING *
            `,
            [
                tempo,
                partidaId
            ]
        );

    return resultado.rows[0];

}

}

module.exports = Partida;