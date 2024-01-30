const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const bcrypt = require('bcrypt');
//importo do dbConfig
const pool = require('./../dbConfig');

const router = express.Router();

router.use(cors());

const products = []

//[GET] - Rota que lista todos os produtos
/*
router.get('/', async(req,res) => {
    const  productsDB = await pool.query('SELECT * FROM products');
    console.log(productsDB.rows)
    res.send(productsDB)
})
*/


//Rota de Cadastro de usuário
router.post('/register', async(req, res) => {
    const {username, email, password} = req.body;

    try {
         // Verifica se o usuário já existe no banco de dados
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if(existingUser.rows.lenght > 0) {
            return res.status(400).send('Usuário já cadastrado.');
        }

        // Criptografa a senha antes de armazená-la no banco de dados
        const hashedPassword = await bcrypt.hash(password, 10)

        // Insere o novo usuário no banco de dados
        const newUser = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso.', userId: newUser.rows[0].id });
    }catch (error) {
        console.error('Erro ao cadastrar usuário', error);
        res.status(500).send('Erro ao cadastrar usuário');
    }
});

// Rota de login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Tentativa de login para o usuário:', username);

        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (user.rows.length === 0) {
            console.log('Usuário não encontrado:', username);
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const hashedPassword = user.rows[0].password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            console.log('Senha incorreta para o usuário:', username);
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        console.log('Login bem-sucedido para o usuário:', username);
        return res.status(200).json({ message: 'Login bem-sucedido' });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ message: 'Erro ao fazer login. Por favor, tente novamente.' });
    }
});

//Metodo de desestruturação.
router.get('/', async(req,res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM products');
        res.send(rows)
    }catch (error) {
        console.error('Erro ao buscar o produto', error);
        res.status(500).json({
            message: 'Erro durante a busca',
            data: error
        })
    }  
})


//[GET] - Rota que retorna um produto por id
router.get('/:id', async(req,res) => {
    // recebe o id via req params
    const id = req.params.id;
    
   
    const { rows } = await pool.query('SELECT * FROM products WHERE id =$1', [id]);
   
    // verifico se existe o produto, se não existir devolvo um 404 com a mensagem "Produto não encontrao"
    if(rows.length === 0) {
        res.status(404).send('Produto não encontrado');
    }
    res.send(rows);
})

// CRUD (CREATE - POST) (READ - GET) (UPDATE - PUT) (DELETE - DELETE)

//[POST] - cadastra um novo produto
router.post('/add', async(req,res) => {
    const product = req.body;
   
    if(!product || !product.name || !product.category || !product.price) {
        res.status(400).send("Está faltando os dados do produto");
        return;
    }
    
    const { rows } = await pool.query('INSERT INTO products (id, name, category, price) VALUES ($1, $2, $3, $4) RETURNING *',
        [crypto.randomUUID(), product.name, product.category, product.price]);
        res.status(201).json({
            status: 'Produto cadastrado com sucesso!',
            data: rows
        })
})

//[DELETE] - exclui um produto
router.delete('/delete/:id',async(req, res) => {
const id = req.params.id;

const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id])

res.json({
    message: "Produto excluído com sucesso",
    data: rows
})
    
})

//[PUT] - Atualiza um produto pré cadastrado
router.put('/edit/:id', async (req, res) => {
//recebo o id via param
const id = req.params.id;
//recebo o objeto com os dados atualizado dos produtos
const editProduct = req.body;

const { rows } = await pool.query('UPDATE products SET name = $1, category = $2, price = $3 WHERE id = $4 RETURNING *',
[editProduct.name, editProduct.category, editProduct.price, id]
)

res.json({
    message: 'Produto editado com sucesso!',
    data: rows
});


})

// exportamos o router para ser usado no index.js
module.exports = router;