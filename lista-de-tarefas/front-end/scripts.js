const tarefasHtml = document.getElementById('tarefas');
console.log(tarefasHtml);


//FETCH API - Usado para trabalhar com requisições HTTP com javascript ( GET, POST, PUT, DELETE)
// Primeiro paramentro - End point da requisição (para onde iremos enviar a nossa requisição do front)
//(http://localhost:3000/tarefas)
// Segundo parametro (opcional) - Configurações da requisição ex: Metodo ( GET, POST, PUT, DELETE)

//FUNÇÃO ASSINCRONA (PROMISESE)
const API = fetch('http://localhost:3000/tarefas');
console.log(API)

API.then((response) => {
    console.log(response)
    return response.json()
}).then((tarefas) => {
    console.log(tarefas)
    tarefas.map((tarefa) => {
        tarefasHtml.insertAdjacentHTML('beforeend', `
        <li>
            <p>Tarefa: ${tarefa.text}</p>
            <p>Prazo:  ${tarefa.prazo}</p>
        <li>
        `)
    })
})
