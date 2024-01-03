const express = require('express');
const crypto = require('crypto');

const router = express.Router();

const products = []

//[GET] - Rota que lista todos os produtos
router.get('/', (req,res) => {
    res.send(products)
})

//[GET] - Rota que retorna um produto por id
router.get('/:id', (req,res) => {
    // recebe o id via req params
    const id = req.params.id;
    // procuro o produto que contém o id igual ao recebido pelo parametro
    const product = products.find(product => product.id == id);

    // verifico se existe o produto, se não existir devolvo um 404 com a mensagem "Produto não encontrao"
    if(!product) {
        res.status(404).send('Produto não encontrado')
    }
    res.send(product)
})

// CRUD (CREATE - POST) (READ - GET) (UPDATE - PUT) (DELETE - DELETE)

//[POST] - cadastra um novo produto
router.post('/add', (req,res) => {
    const product = req.body;
    const newProduct = {
        id: crypto.randomUUID(),
        ...product
        }

        if(!product || !product.name || !product.category || !product.price) {
            res.status(400).send("Está faltando os dados do produto");
        }
        
        products.push(newProduct);
        res.status(201).send('Produto cadastrado com sucesso!')
})

//[DELETE] - exclui um produto
router.delete('/delete/:id', (req, res) => {
const id = req.params.id;

//procuro em qual posição está o produto pelo seu id
const index = products.findIndex(product => product.id == id);

products.splice(index, 1);
res.send("Produto excluído com sucesso!");
    
})

//[PUT] - Atualiza um produto pré cadastrado
router.put('/edit/:id', (req, res) => {
//recebo o id via param
const id = req.params.id;

//recebo o objeto com os dados atualizado dos produtos
const editProduct = req.body;

//procuro em qual posição está o produto pelo seu id
const index = products.findIndex(product => product.id == id);

products[index] = {
    ...products[index],
    ...editProduct
}

console.log(products[index])

res.send('Produto atualizado com sucesso!');


})

// exportamos o router para ser usado no index.js
module.exports = router;