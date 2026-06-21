const pool =
    require("../config/db");

class PontoVolei {

    static async criar(
        partidaId,
        jogadorId,
        equipeId,
        lado
    ) {

        const resultado =
            await pool.query(
                `
                INSERT INTO pontos_volei
                (
                    partida_id,
                    jogador_id,
                    equipe_id,
                    lado
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
                    equipeId,
                    lado
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
                pv.*,
                j.nome,
                j.numero
            FROM pontos_volei pv
            INNER JOIN jogadores j
                ON j.id = pv.jogador_id
            WHERE pv.partida_id = $1
            ORDER BY pv.id DESC
            `,
            [partidaId]
        );

    return resultado.rows;

}

    static async rankingPartida(
        partidaId
    ) {

        const resultado =
            await pool.query(
                `
                SELECT
                    j.nome,
                    pv.equipe_id,
                    COUNT(*)::INTEGER AS pontos
                FROM pontos_volei pv
                INNER JOIN jogadores j
                    ON j.id = pv.jogador_id
                WHERE pv.partida_id = $1
                GROUP BY
                    j.nome,
                    pv.equipe_id
                ORDER BY pontos DESC
                `,
                [partidaId]
            );

        return resultado.rows;

    }

    static async excluir(id) {

    await pool.query(
        `
        DELETE FROM pontos_volei
        WHERE id = $1
        `,
        [id]
    );

}

}

module.exports =
    PontoVolei;