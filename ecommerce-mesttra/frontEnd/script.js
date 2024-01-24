// buscar o elemento lista que vai listar meus produtos
const lista = document.querySelector('#lista');

// URL da API
const apiURL = 'http://localhost:3000/products';

// Busco os meus inputs para pegar o que o usuário digitou;
const nameInput = document.querySelector('#name');
const categoryInput = document.querySelector('#category');
const priceInput = document.querySelector('#price');

const getProducts = async () => {
    lista.innerHTML = '';
    const response = await fetch(apiURL);
    const products = await response.json();

    products.map((product) => {
        lista.insertAdjacentHTML('beforeend', `
        <li class="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4 mb-4">
            <div class="bg-white shadow-md rounded-md p-4">
                <h2 class="text-xl font-semibold mb-2"> ${product.name}</h2>
                <p class="text-gray-600">Categoria: ${product.category}</p>
                <p class="text-gray-800 font-bold">Preço: R$ ${product.price}</p>
                <div class="flex justify-between mt-2">
                    <button onclick="editProduct('${product.id}')" data-id="${product.id}" class="bg-green-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Editar</button>
                    <button onclick="deleteProduct('${product.id}')" class="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Excluir</button>
                </div>
                <div id="editForm_${product.id}" style="display: none;">
                    <input type="text" id="editName_${product.id}" placeholder="Novo nome" />${product.id}
                    <input type="text" id="editCategory_${product.id}" placeholder="Nova categoria" />
                    <input type="text" id="editPrice_${product.id}" placeholder="Novo preço" />
                    <button onclick="saveEdit('${product.id}')">Salvar</button>
                </div
            </div>
        </li>
        `);
    });
};

// Função para abrir o modal de edição
const editProduct = async (id)=> {
    try {
        // Fazer uma solicitação para obter os detalhes do produto com base no ID
        const response = await fetch(`${apiURL}/${id}`);
        const product = await response.json();
        console.log(product)
                
        // Preencher os campos do modal com os dados do produto
        const modalEditName = document.getElementById('editName');
        const modalEditCategory = document.getElementById('editCategory');
        const modalEditPrice = document.getElementById('editPrice');
           
           
        modalEditName.value = product[0].name;
        modalEditCategory.value = product[0].category;
        modalEditPrice.value = product[0].price
        console.log(modalEditCategory.value)

        // Armazenar o ID do produto como um atributo do botão de salvar
        document.getElementById('saveEditButton').dataset.productId = id;

        // Mostrar o modal
        document.getElementById('editModal').classList.remove('hidden');
    } catch (error) {
        console.error('Erro ao obter detalhes do produto para edição:', error);
    }
}


// Função para fechar o modal
function closeModal() {
    // Resetar os campos de edição para os valores originais
    document.getElementById('editName').value = '';
    document.getElementById('editCategory').value = '';
    document.getElementById('editPrice').value = '';

    // Ocultar o modal
    document.getElementById('editModal').classList.add('hidden');
}

// Função para cancelar a edição
function cancelEdit() {
    // Resetar os campos de edição para os valores originais
    document.getElementById('editName').value = '';
    document.getElementById('editCategory').value = '';
    document.getElementById('editPrice').value = '';

    // Fechar o modal
    closeModal();
}

// Função para salvar a edição
async function saveEdit() {
    const editName = document.getElementById('editName').value;
    const editCategory = document.getElementById('editCategory').value;
    const editPrice = document.getElementById('editPrice').value;

    const productId = document.getElementById('saveEditButton').dataset.productId;

    const editedProduct = {
        name: editName,
        category: editCategory,
        price: editPrice,
    };

    const request = new Request(`${apiURL}/edit/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(editedProduct),
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
    });

    const response = await fetch(request);
    const data = await response.json();
    console.log(data);

    // Fechar o modal após a edição
    closeModal();

    // Atualizar a lista de produtos
    getProducts();
}

// Função para deletar o produto
async function deleteProduct(id) {
    // Confirmar se o usuário realmente deseja excluir o produto
    const confirmDelete = confirm('Tem certeza que deseja excluir este produto?');

    if (confirmDelete) {
        // Enviar uma solicitação DELETE para a API
        const request = new Request(`${apiURL}/delete/${id}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        });

        const response = await fetch(request);
        const data = await response.json();
        console.log(data);

        // Atualizar a lista de produtos após a exclusão
        getProducts();
    }
}

// Função para enviar o formulário
const submitForm = async (event) => {
    event.preventDefault();

    // Monto o que vai para o backend no post
    const product = {
        name: nameInput.value,
        category: categoryInput.value,
        price: priceInput.value,
    };

    // Enviar para o backend com requisição de post
    const request = new Request(`${apiURL}/add`, {
        method: 'POST',
        body: JSON.stringify(product),
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
    });

    const response = await fetch(request);
    const data = await response.json();
    console.log(data);

    alert(`Produto ${data.data[0].name} cadastrado!`);
    getProducts();
};

getProducts();