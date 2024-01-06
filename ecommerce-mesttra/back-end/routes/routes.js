const express = require('express');
const crypto = require('crypto');
//importo do dbConfig
const pool = require('./../dbConfig');


const router = express.Router();

const products = []

//[GET] - Rota que lista todos os produtos
/*
router.get('/', async(req,res) => {
    const  productsDB = await pool.query('SELECT * FROM products');
    console.log(productsDB.rows)
    res.send(productsDB)
})
*/
//Metodo de desestruturação.
router.get('/', async(req,res) => {
    const { rows } = await pool.query('SELECT * FROM products');
    res.send(rows)
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
    res.send(rows)
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