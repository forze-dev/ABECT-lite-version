<?php
function loadEnv($path)
{
    if (!file_exists($path)) {
        return false;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        list($key, $value) = explode('=', $line, 2);
        putenv(trim($key) . '=' . trim($value));
    }
}

loadEnv(__DIR__ . '/../../.env');

$botToken = getenv('TELEGRAM_BOT_TOKEN');
$chatId = getenv('CHAT_ID');

if (!$botToken || !$chatId) {
    http_response_code(500);
    die('Помилка: не вдалося отримати токен або ID чату.');
}

//  НОВІ ДАНІ
$name = isset($_POST['username']) ? trim($_POST['username']) : 'Не вказано';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : 'Не вказано';
$comment = isset($_POST['comment']) ? trim($_POST['comment']) : 'Коментар не залишено';

//  ФОРМУВАННЯ ПОВІДОМЛЕННЯ
$text = "Заявка з сайту\n\n";
$text .= "Ім'я: $name\n";
$text .= "Телефон: $phone\n";
$text .= "Коментар: $comment\n";

//  ОБРОБКА ФАЙЛУ
$hasFile = false;
$filePath = null;

if (isset($_FILES['drawing']) && $_FILES['drawing']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['drawing'];
    
    // Валідація розміру (20MB)
    if ($file['size'] > 20 * 1024 * 1024) {
        http_response_code(400);
        die('Файл занадто великий! Максимум 20MB');
    }
    
    // Валідація типу
    $allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    if (!in_array($file['type'], $allowedTypes) && $fileExtension !== 'dwg') {
        http_response_code(400);
        die('Неприпустимий тип файлу!');
    }
    
    $hasFile = true;
    $filePath = $file['tmp_name'];
    $fileName = $file['name'];
    $text .= "\nКористувач прикріпив файл!\n";
}

//  ВІДПРАВКА В TELEGRAM
try {
    if ($hasFile) {
        // Відправляємо файл з підписом
        $url = "https://api.telegram.org/bot$botToken/sendDocument";
        
        $postData = [
            'chat_id' => $chatId,
            'caption' => $text,
            'document' => new CURLFile($filePath, $file['type'], $fileName)
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
    } else {
        // Відправляємо тільки текст
        $url = "https://api.telegram.org/bot$botToken/sendMessage?chat_id=$chatId&text=" . urlencode($text);
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
    }
    
    if ($httpCode == 200) {
        echo 'Повідомлення успішно відправлено.';
    } else {
        http_response_code(500);
        echo 'Помилка відправки: ' . $httpCode;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo 'Помилка: ' . $e->getMessage();
}
?>