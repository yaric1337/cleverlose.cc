<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['email']) || !isset($input['code'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and code required']);
    exit;
}

$email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
$code = $input['code'];

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email']);
    exit;
}

// Проверка на украинские домены
$ukrainianDomains = [
    'ukr.net', 'i.ua', 'meta.ua', 'bigmir.net', 'online.ua',
    'gmail.ua', 'yandex.ua', 'mail.ua', 'inbox.ua'
];

$domain = strtolower(substr(strrchr($email, "@"), 1));
if (in_array($domain, $ukrainianDomains)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ukrainian domains not supported']);
    exit;
}

// HTML шаблон письма
$subject = 'Код подтверждения Cleverlose';
$message = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 15px; padding: 40px; border: 1px solid rgba(199, 125, 255, 0.2); }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo-text { font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #7209b7 0%, #c77dff 50%, #e0aaff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .title { font-size: 28px; font-weight: bold; text-align: center; margin-bottom: 20px; color: #ffffff; }
        .code-container { background: rgba(199, 125, 255, 0.1); border: 2px solid #7209b7; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0; }
        .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #c77dff; font-family: monospace; }
        .text { font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.8); text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(199, 125, 255, 0.2); color: rgba(255, 255, 255, 0.6); font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <div class="logo-text">⚡ Cleverlose</div>
        </div>
        
        <h1 class="title">Подтверждение регистрации</h1>
        
        <p class="text">
            Добро пожаловать в Cleverlose! Для завершения регистрации введите код подтверждения:
        </p>
        
        <div class="code-container">
            <div class="code">' . $code . '</div>
        </div>
        
        <p class="text">
            Код действителен в течение 10 минут.<br>
            Если вы не регистрировались на Cleverlose, просто проигнорируйте это письмо.
        </p>
        
        <div class="footer">
            <p>© 2024 Cleverlose. Все права защищены.</p>
            <p>Премиум конфиги для CS2, Valorant и Apex Legends</p>
        </div>
    </div>
</body>
</html>';

// Заголовки для HTML письма
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Cleverlose <noreply@cleverlose.cc>',
    'Reply-To: support@cleverlose.cc',
    'X-Mailer: PHP/' . phpversion()
];

// Отправка письма
$success = mail($email, $subject, $message, implode("\r\n", $headers));

if ($success) {
    echo json_encode([
        'success' => true, 
        'message' => 'Verification code sent successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to send email'
    ]);
}
?>
