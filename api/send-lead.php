<?php

header('Content-Type: application/json; charset=utf-8');

date_default_timezone_set('Europe/Moscow');

$recipientEmail = 'skillforcce@gmail.com';
$googleSheetsWebhook = 'https://script.google.com/macros/s/AKfycbxtpLqw1nwx6vwurYUswHtivPHRftqZTNW5mxrMkyATbToVh5piq2QTxScZNFuWp8Jb/exec';
$siteName = 'Контракт на СВО';
$fromEmail = 'no-reply@avitor4c.beget.tech';

function respond($status, $payload)
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function clean_string($value)
{
    $value = is_scalar($value) ? (string) $value : '';
    $value = trim($value);
    $cleaned = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', $value);
    return $cleaned === null ? '' : $cleaned;
}

function h($value)
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function field_label($name)
{
    $labels = array(
        'name' => 'Имя',
        'phone' => 'Телефон',
        'vacancy' => 'Выбранная вакансия',
        'birthdate' => 'Дата рождения',
        'city' => 'Город',
        'privacy' => 'Согласие с политикой',
        'consent' => 'Согласие на звонок',
    );

    return isset($labels[$name]) ? $labels[$name] : $name;
}

function form_title($formName)
{
    switch ($formName) {
        case 'callback':
            return 'Заказ обратного звонка';
        case 'main-application':
            return 'Заявка с основной формы';
        default:
            return 'Заявка с сайта';
    }
}

function encode_header($value)
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function calculate_age($birthdate)
{
    if ($birthdate === '') {
        return '';
    }

    $birth = DateTime::createFromFormat('Y-m-d', $birthdate);
    if (!$birth) {
        return '';
    }

    $today = new DateTime('today');
    return (string) $birth->diff($today)->y;
}

function post_json($url, $payload)
{
    if ($url === '') {
        return true;
    }

    $json = json_encode($payload, JSON_UNESCAPED_UNICODE);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 8);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        $response = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $response !== false && $status >= 200 && $status < 400;
    }

    $context = stream_context_create(array(
        'http' => array(
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $json,
            'timeout' => 30,
        ),
    ));

    return file_get_contents($url, false, $context) !== false;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, array('success' => false, 'message' => 'Метод не поддерживается.'));
}

if ($recipientEmail === '' && $googleSheetsWebhook === '') {
    respond(500, array('success' => false, 'message' => 'Прием заявок еще не настроен.'));
}

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody ? $rawBody : '', true);

if (!is_array($data)) {
    respond(400, array('success' => false, 'message' => 'Некорректные данные формы.'));
}

$formName = clean_string(isset($data['formName']) ? $data['formName'] : '');
$page = clean_string(isset($data['page']) ? $data['page'] : '');
$fields = isset($data['fields']) && is_array($data['fields']) ? $data['fields'] : array();

$name = clean_string(isset($fields['name']) ? $fields['name'] : '');
$phone = clean_string(isset($fields['phone']) ? $fields['phone'] : '');
$vacancy = clean_string(isset($fields['vacancy']) ? $fields['vacancy'] : '');
$birthdate = clean_string(isset($fields['birthdate']) ? $fields['birthdate'] : '');
$city = clean_string(isset($fields['city']) ? $fields['city'] : '');

if ($name === '' || $phone === '') {
    respond(422, array('success' => false, 'message' => 'Заполните имя и телефон.'));
}

if ($formName === 'main-application' && ($vacancy === '' || $birthdate === '' || $city === '')) {
    respond(422, array('success' => false, 'message' => 'Выберите вакансию, дату рождения и город.'));
}

$safeFields = array();
foreach ($fields as $key => $value) {
    $safeFields[clean_string($key)] = clean_string($value);
}

$submittedAt = date('d.m.Y H:i:s');
$ip = clean_string(isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '');
$userAgent = clean_string(isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '');
$title = form_title($formName);
$subject = 'Новая заявка: ' . $title;
$sheetPayload = array(
    'submittedAt' => $submittedAt,
    'phone' => $phone,
    'name' => $name,
    'vacancy' => $formName === 'callback' ? 'Обратный звонок' : $vacancy,
    'city' => $city,
    'age' => calculate_age($birthdate),
    'status' => 'Новая',
    'operator' => '',
    'page' => $page,
    'formName' => $formName,
);

$rows = '';
foreach ($safeFields as $key => $value) {
    $rows .= '<tr><th style="padding:10px 12px;text-align:left;border:1px solid #d9e2ec;background:#f3f7fb;">' . h(field_label($key)) . '</th><td style="padding:10px 12px;border:1px solid #d9e2ec;">' . nl2br(h($value)) . '</td></tr>';
}

$htmlMessage = '<!doctype html><html><head><meta charset="UTF-8"></head><body style="font-family:Arial,sans-serif;color:#0d1726;">'
    . '<h2 style="margin:0 0 16px;">' . h($title) . '</h2>'
    . '<table style="border-collapse:collapse;width:100%;max-width:720px;">' . $rows . '</table>'
    . '<p style="margin-top:18px;color:#526070;">Страница: ' . h($page) . '<br>Дата: ' . h($submittedAt) . '<br>IP: ' . h($ip) . '<br>User-Agent: ' . h($userAgent) . '</p>'
    . '</body></html>';

$textLines = array($title, '');
foreach ($safeFields as $key => $value) {
    $textLines[] = field_label($key) . ': ' . $value;
}
$textLines[] = '';
$textLines[] = 'Страница: ' . $page;
$textLines[] = 'Дата: ' . $submittedAt;
$textLines[] = 'IP: ' . $ip;
$textMessage = implode("\n", $textLines);

$boundary = 'lead_' . md5(uniqid((string) mt_rand(), true));
$headers = array(
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    'From: ' . encode_header($siteName) . ' <' . $fromEmail . '>',
    'Reply-To: ' . $recipientEmail,
);

$body = '--' . $boundary . "\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n"
    . "Content-Transfer-Encoding: 8bit\r\n\r\n"
    . $textMessage . "\r\n"
    . '--' . $boundary . "\r\n"
    . "Content-Type: text/html; charset=UTF-8\r\n"
    . "Content-Transfer-Encoding: 8bit\r\n\r\n"
    . $htmlMessage . "\r\n"
    . '--' . $boundary . "--\r\n";

$mailSent = true;
if ($recipientEmail !== '') {
    $mailSent = mail($recipientEmail, encode_header($subject), $body, implode("\r\n", $headers));
}

$sheetSent = post_json($googleSheetsWebhook, $sheetPayload);

if (!$mailSent) {
    respond(500, array('success' => false, 'message' => 'Письмо не отправилось. Проверьте почту отправки на хостинге.'));
}

if (!$sheetSent) {
    respond(500, array('success' => false, 'message' => 'Заявка не записалась в Google Таблицу.'));
}

respond(200, array('success' => true));
