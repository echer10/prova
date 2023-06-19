<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type'); // 1

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->prepare("SELECT * FROM Pedidos");
    $stmt -> execute();
    $pedidos = $stmt ->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($pedidos);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {//metodo para fazer uma reserva
    $itens = $_POST['itens'];
    $quantidade = $_POST['quantidade'];
    $valor_uni = $_POST['valor_uni'];
    $total = $_POST['total'];
    
    //insert into Pedidos (itens, quantidade, valor_uni, total) values ("hamburguer", 3, 23.5, 70.5)
    $stmt = $conn->prepare("INSERT INTO Pedidos (itens, quantidade, valor_uni, total) VALUES (:itens, :quantidade, :valor_uni, :total)");
    $stmt -> bindParam(':itens', $itens);
    $stmt -> bindParam(':quantidade', $quantidade);
    $stmt -> bindParam(':valor_uni', $valor_uni);
    $stmt -> bindParam(':total', $total);
   

    if ($stmt->execute()){
        echo "pedido adicionado";
    } else {
        echo "erro ao adicionar produto";
    }

}

//rotas para atualizar pedido
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset ($_GET['id'])) {
    
    //convertando dados
    parse_str(file_get_contents("php://input"), $_PUT);

    $id = $_GET['id'];
    $novoItem= $_PUT['itens'];
    $novoQuantidade = $_PUT['quantidade'];
    $novoValor_uni = $_PUT['valor_uni'];
    $novoTotal = $_PUT['total'];

    //insert into Pedidos (itens, quantidade, valor_uni, total) values ("hamburguer", 3, 23.5, 70.5)
    $stmt = $conn->prepare("UPDATE Pedidos SET itens = :itens, quantidade = :quantidade, valor_uni = :valor_uni, total = :total WHERE id = :id");
    $stmt->bindParam(':itens', $novoItem);
    $stmt->bindParam(':quantidade', $novoQuantidade);
    $stmt->bindParam(':valor_uni', $novoValor_uni);
    $stmt->bindParam(':total', $novoTotal);
    $stmt->bindParam(':id', $id);

    if ($stmt->execute()) {
        echo "produto atualizado com sucesso";
    } else {
        echo "erro ao atualizar :(";
    }

}

//rota para deletar

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    $id = $_GET['id'];
    $stmt = $conn->prepare("DELETE FROM Pedidos WHERE id = :id");
    $stmt->bindParam(':id', $id);

    if ($stmt->execute()) {
        echo "reserva excluida com sucesso";
    } else {
        echo "erro ao excluir :(";
    }
}




// PUT - UTILIZA PARA ATUALIZAR
// DELETE - UTILIZA PARA DELETAR
// OPTIONS -
// 1 - permite com que qualquer header consiga acessar o sistema



?>