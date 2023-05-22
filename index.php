<!-- <?php
require 'vendor/autoload.php';
use Telegram\Bot\Api;

$token = 'AAH3ikiRkcAP3qVpKjZA9mfh1IC95pHGxVk';
$bot = new Api($token);
$groupChatId = -740721555;

$messageText = [
    'title' => "Новый опозднун!",
    'name' => '',
    'reason' => '',
    'time' => '',
    'emoji' => "\u{263A}"
];

$step = '';

$update = $bot->getWebhookUpdates();
if ($update->has('message')) {
    $message = $update->getMessage();
    $chatId = $message->getChat()->getId();
    $text = $message->getText();

    if ($text === '/start') {
        $bot->sendMessage(['chat_id' => $chatId, 'text' => "Ваши имя и фамилия"]);
        $step = 'name';
    } elseif ($step === 'name') {
        $messageText['name'] = $text;
        $bot->sendMessage(['chat_id' => $chatId, 'text' => "Причина опоздания"]);
        $step = 'reason';
    } elseif ($step === 'reason') {
        $messageText['reason'] = $text;
        $bot->sendMessage(['chat_id' => $chatId, 'text' => "На сколько опаздываете?"]);
        $step = 'time';
    } elseif ($step === 'time') {
        $messageText['time'] = $text;
        $step = '';
        $finalMessage = "<b>{$messageText['title']}</b>\n\u{1F464} Имя - {$messageText['name']}\n\u{2753} Причина - {$messageText['reason']}\n\u{23F0} Опаздывает на - {$messageText['time']}";
        $bot->sendMessage(['chat_id' => $chatId, 'text' => "Ваше сообщение отправлено Костиной А. и Царьковой Е. \u{263A}"]);
        $bot->sendMessage(['chat_id' => $groupChatId, 'text' => $finalMessage, 'parse_mode' => 'HTML']);
    }
} -->

/* В этом коде мы используем библиотеку telegram-bot-sdk для работы с Telegram API. Вы можете установить эту библиотеку с помощью Composer:

composer require irazasyed/telegram-bot-sdk
Копировать
Код создает объект Api с помощью токена вашего бота и устанавливает начальные значения для переменных messageText и step. Затем он получает обновления от Telegram API с помощью метода getWebhookUpdates и проверяет, есть ли в обновлении сообщение. Если сообщение есть, код извлекает идентификатор чата и текст сообщения и выполняет соответствующие действия в зависимости от текущего значения переменной step.

Обратите внимание, что этот код использует механизм вебхуков для получения обновлений от Telegram API. Это означает, что вы должны настроить вебхук для вашего бота и разместить этот код на сервере с доступом к Интернету. Если вы хотите использовать механизм опроса (polling) вместо вебхуков, вы можете изменить код соответствующим образом. */