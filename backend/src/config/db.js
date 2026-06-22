const { Pool } =
    require("pg");

const pool =
    new Pool({

        connectionString:
            process.env.DATABASE_URL,

        ssl: {
            rejectUnauthorized:
                false
        }

    });

pool.query(
    "SELECT current_database(), current_user"
)
.then(resultado => {

    console.log(
        "Banco conectado:",
        resultado.rows
    );

})
.catch(console.error);

pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
`)
.then(resultado => {
    console.log(
        "Tabelas encontradas:",
        resultado.rows
    );
})
.catch(console.error);

module.exports =
    pool;