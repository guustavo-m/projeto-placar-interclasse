const pool = require("../config/db");

class Equipe {

static async criar(
    nome,
    cor,
    bandeira,
    modalidadeId,
    periodo
) {

    const resultado =
        await pool.query(
            `
            INSERT INTO equipes
            (
                nome,
                cor,
                bandeira,
                modalidade_id,
                periodo
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5
            )
            RETURNING *
            `,
            [
                nome,
                cor,
                bandeira,
                modalidadeId,
                periodo
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

static async listarPorFiltro(
    modalidade,
    periodo
) {

        console.log(
        "FILTRO:",
        modalidade,
        periodo
    );

    const resultado =
        await pool.query(
            `
SELECT
    e.id,
    e.nome,
    e.cor,
    e.bandeira,
    e.modalidade_id,
    e.periodo
FROM equipes e
INNER JOIN modalidades m
    ON m.id = e.modalidade_id
WHERE e.modalidade_id = $1
AND e.periodo = $2
ORDER BY e.nome
            `,
            [
                modalidade,
                periodo
            ]
        );

            console.log(
        "RESULTADO:",
        resultado.rows
    );

    return resultado.rows;

}

static async atualizar(
    id,
    nome,
    cor,
    bandeira,
    modalidadeId,
    periodo
) {

    const resultado =
        await pool.query(
            `
            UPDATE equipes
            SET
                nome = $1,
                cor = $2,
                bandeira = $3,
                modalidade_id = $4,
                periodo = $5
            WHERE id = $6
            RETURNING *
            `,
            [
                nome,
                cor,
                bandeira,
                modalidadeId,
                periodo,
                id
            ]
        );

    return resultado.rows[0];

}

static async excluir(id) {
const possuiPartidas =
    await pool.query(
        `
        SELECT id
        FROM partidas
        WHERE
            equipe_a = $1
            OR equipe_b = $1
        LIMIT 1
        `,
        [id]
    );
    const possuiJogadores =
    await pool.query(
        `
        SELECT id
        FROM jogadores
        WHERE equipe_id = $1
        LIMIT 1
        `,
        [id]
    );

    if (
    possuiPartidas.rows.length > 0
) {

    throw new Error(
        "Equipe possui partidas"
    );

}

if (
    possuiJogadores.rows.length > 0
) {

    throw new Error(
        "Equipe possui jogadores"
    );

}
    await pool.query(
        `
        DELETE FROM equipes
        WHERE id = $1
        `,
        [id]
    );

}

}

module.exports = Equipe;