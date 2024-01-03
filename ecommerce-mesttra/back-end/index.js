//MESTTRA ECOMMERCE

const express = require('express');
const productRouter = require('./routes/routes');

const app = express();

app.use(express.json());
app.use('/products', productRouter)

app.get('/', (req, res) =>{
    setTimeout(() => {
        res.send('Olá galera');
    }, 5000);
})

const port = 3000;
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    })
