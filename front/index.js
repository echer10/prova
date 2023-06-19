const form = document.querySelector('#pedidoForm')
const itemInput = document.getElementsByName("item")
const qtdInput = document.querySelector('#qtd')
const precoInput = document.querySelector('#preco')
const tableBody = document.querySelector('#tabelaPedidos tbody')
// const checkBoxSelecionadas = document.querySelectorAll('#item')

let total 

let itemSelecionado


const URL = "http://localhost:8000/pedidos.php"

function ExibirPedidos() {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'

        },
        mode: "cors"
    })

        .then(response => response.json())
        .then(pedidos => {
            tableBody.innerHTML = ''

            pedidos.forEach(pedido => {
                const tr = document.createElement('tr')
                
                //faz o calculo do total a ser pago
                total = pedido.valor_uni * pedido.quantidade
                parseFloat(total)

                
                tr.innerHTML = `
        
                <td>${pedido.id}</td>
                <td>${pedido.itens}</td>
                <td>${pedido.quantidade}</td>
                <td>${pedido.valor_uni}</td>
                <td>R$ ${total}</td>
                
                <td>
                <button data-id="${pedido.id}" onclick="atualizarPedido(${pedido.id})" class="btn btn-primary">Editar</button>
                <button onclick="excluirPedido(${pedido.id})" class="btn btn-danger">Excluir</button>
                </td>
                `
                tableBody.appendChild(tr)
            })     
            
            
            
        })
}

function adicionarPedido(event) {
    event.preventDefault()

    //verifica qual item do cardapio foi selecionado
    for(i = 0; i < itemInput.length; i++){
        if(itemInput[i].checked){
            itemSelecionado = itemInput[i].value
        }
    }
    

            const item = itemSelecionado         
            const qtd = qtdInput.value
            let preco

            //define o preço unitario
            if(itemSelecionado == "batata"){
                preco = 13.5
            }else if(itemSelecionado == "hamburguer"){
                preco = 23.5
            }else if(itemSelecionado == "refrigerante"){
                preco = 5.0
            }


            

            fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'

                },
                body: `itens=${encodeURIComponent(item)}&quantidade=${encodeURIComponent(qtd)}&valor_uni=${encodeURIComponent(preco)}&total=${encodeURIComponent(total)}`
            })

                .then(response => {
                    if (response.ok) {
                        
                        qtdInput.value = ''
                        precoInput.value = ''
                        
                    } else {
                        console.error('erro ao add produto')
                        alert('error ao add produto')
                    }

                })
                console.log(itemSelecionado)
    //adicionar itens juntos 
    // for(let i = 0; i < checkBoxSelecionadas.length; i++){
    //     if(checkBoxSelecionadas[i].checked){
    //         itensSelecionados.push(`${checkBoxSelecionadas[i].value}, `)
    //     }else{
    //         itensSelecionados.pop(`${checkBoxSelecionadas[i].value}, `)
    //     }
    
    // }

}

function excluirPedido(id) {
    if (confirm('Deseja excluir esse produto?')) {
        fetch(`${URL}?id=${id}`, {
            method: 'DELETE'
        })

            .then(response => {
                if (response.ok) {
                    ExibirPedidos()
                } else {
                    alert('Error ao excluir o produto')
                }
            })
    }
}

function atualizarPedido(id) {

    const novoitem = prompt('Digite o item')
    const novoQtd = prompt('Digite a quantidade')
    const novoPreco = prompt('Digite o preço')


    if (novoitem && novoQtd && novoPreco) {
        fetch(`${URL}?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'

            },
            body: `itens=${encodeURIComponent(novoitem)}&quantidade=${encodeURIComponent(novoQtd)}&valor_uni=${encodeURIComponent(novoPreco)}`
        })
            .then(response => {
                if (response.ok){
                    ExibirPedidos()                    
                }else{
                    alert('Error ao editar o produto')
                }
            })


    }


}


ExibirPedidos()

form.addEventListener('submit', adicionarPedido)
