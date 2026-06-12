const pool = require("../config/db");

class Modalidade {

    static async listar() {

        const resultado = await pool.query(
            `
            SELECT *
            FROM modalidades
            ORDER BY nome
            `
        );

        return resultado.rows;

    }

    static async buscarPorId(id) {

        const resultado = await pool.query(
            `
            SELECT *
            FROM modalidades
            WHERE id = $1
            `,
            [id]
        );

        return resultado.rows[0];

    }

}

module.exports = Modalidade;