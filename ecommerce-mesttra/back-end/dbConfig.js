// importo o Pool do postgres-node
const { Pool } = require('pg');

// inicio a minha classe de configuração do pool de conexão

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce',
    password: 'joel',
    port: 5432
});

const teste = async() => {
    const result = await pool.query('SELECT * FROM products');
    console.log(result.rows[0]);
}

teste();

//exporto a minha cosntante pool
module.exports = pool;