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

module.exports =
    pool;