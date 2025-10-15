<?php
header('Content-Type: application/json; charset=utf-8');
$urlsFile = '/opt/raspberry-requests/urls.txt';

// Se for POST — atualizar lista
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['urls'])) {
        echo json_encode(['success' => false, 'msg' => 'Nenhum dado recebido']);
        exit;
    }

    $urls = trim($_POST['urls']);
    $lines = explode("\n", $urls);
    $validUrls = [];

    foreach ($lines as $url) {
        $url = trim($url);
        if ($url && filter_var($url, FILTER_VALIDATE_URL)) {
            $validUrls[] = $url;
        }
    }

    if (empty($validUrls)) {
        echo json_encode(['success' => false, 'msg' => 'Nenhuma URL válida']);
        exit;
    }

    file_put_contents($urlsFile, implode(PHP_EOL, $validUrls) . PHP_EOL);
    echo json_encode(['success' => true, 'msg' => '✅ URLs atualizadas com sucesso']);
    exit;
}

// Se for GET — apenas mostrar conteúdo
if (file_exists($urlsFile)) {
    $urls = file($urlsFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    echo json_encode(['success' => true, 'urls' => $urls]);
} else {
    echo json_encode(['success' => false, 'msg' => 'Arquivo de URLs não encontrado']);
}
?>
