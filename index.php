<?php

require_once 'vendor/autoload.php';
// use Telegram\Bot\Api;
use TelegramBot\Api\Client;
use TelegramBot\Api\Types\Inline\InlineKeyboardMarkup;

$token = 'AAH3ikiRkcAP3qVpKjZA9mfh1IC95pHGxVk';
$bot = new Client($token, ['polling' => true]);
$groupChatId = -740721555;

// Клавиатура с командами
$commandsKeyboard = [
    [
        ['text' => 'День за свой счет', 'callback_data' => '/weekend'],
        ['text' => 'На удаленке', 'callback_data' => '/distant'],
    ],
    [
        ['text' => 'Буду позже', 'callback_data' => '/be_later'],
        ['text' => 'Опаздываю', 'callback_data' => '/late'],
    ],
    [
        ['text' => 'Командировка', 'callback_data' => '/business_trip'],
        ['text' => 'В отпуске', 'callback_data' => '/vacation'],
        ['text' => 'Заболел', 'callback_data' => '/pain'],
    ]
];

// Обработчик команды /start
$bot->on(function ($update) use ($bot, $commandsKeyboard) {
    $message = $update->getMessage();
    $chatId = $message->getChat()->getId();
    $messageText = 'Привет! Выберите одну из команд:';
    $keyboard = new InlineKeyboardMarkup($commandsKeyboard);
    $bot->sendMessage($chatId, $messageText, null, false, null, $keyboard);
}, function ($update) {
    $message = $update->getMessage();
    return $message !== null && mb_stripos($message->getText(), '/start') !== false;
});

// Обработчик нажатия на кнопки
$bot->on('callback_query', function ($update) use ($bot, $groupChatId) {
    $callbackQuery = $update->getCallbackQuery();
    $chatId = $callbackQuery->getMessage()->getChat()->getId();
    $data = $callbackQuery->getData();
    $messageText = [];

    if ($data === '/weekend') {
        $messageText['title'] = 'День за свой счет';
        $bot->sendMessage($chatId, $questions['weekend']['q1']);
        $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
            $message = $update->getMessage();
            $messageText['q1'] = $message->getText();
            $bot->sendMessage($chatId, $questions['weekend']['q2']);
            $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
                $message = $update->getMessage();
                $messageText['q2'] = $message->getText();
                $bot->sendMessage($chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' . mb_convert_encoding('&#x1F49B;', 'UTF-8', 'HTML-ENTITIES'));
                $finalMessage = "<b>{$messageText['title']}</b>\n"
                    . "&#x1F464; Имя - {$messageText['q1']}\n"
                    . "&#x2753; Дней взял - {$messageText['q2']}";
                $bot->sendMessage($groupChatId, $finalMessage, 'HTML');
            });
        });
    } elseif ($data === '/distant') {
        $messageText['title'] = 'На удаленке';
        $bot->sendMessage($chatId, $questions['distant']['q1']);
        $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
            $message = $update->getMessage();
            $messageText['q1'] = $message->getText();
            $bot->sendMessage($chatId, $questions['weekend']['q2']);
            $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
                $message = $update->getMessage();
                $messageText['q2'] = $message->getText();
                $bot->sendMessage($chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' . mb_convert_encoding('&#x1F49B;', 'UTF-8', 'HTML-ENTITIES'));
                $finalMessage = "<b>{$messageText['title']}</b>\n"
                    . "&#x1F464; Имя - {$messageText['q1']}\n"
                    . "&#x2753; Дней на удаленке - {$messageText['q2']}";
                $bot->sendMessage($groupChatId, $finalMessage, 'HTML');
            });
        });
    } elseif ($data === '/late') {
        $messageText['title'] = 'Опаздываю';
        $bot->sendMessage($chatId, $questions['late']['q1']);
        $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
            $message = $update->getMessage();
            $messageText['q1'] = $message->getText();
            $bot->sendMessage($chatId, $questions['late']['q2']);
            $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
                $message = $update->getMessage();
                $messageText['q2'] = $message->getText();
                $bot->sendMessage($chatId, $questions['late']['q3']);
                $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
                    $message = $update->getMessage();
                    $messageText['q3'] = $message->getText();
                    $bot->sendMessage($chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' . mb_convert_encoding('&#x1F49B;', 'UTF-8', 'HTML-ENTITIES'));
                    $finalMessage = "<b>{$messageText['title']}</b>\n"
                        . "&#x1F464; Имя - {$messageText['q1']}\n"
                        . "&#x23F0; Опаздывает на - {$messageText['q2']}\n"
                        . "&#x2753; Причина - {$messageText['q3']}";
                    $bot->sendMessage($groupChatId, $finalMessage, 'HTML');
                });
            });
        });
    } elseif ($data === '/be_later') {
        $messageText['title'] = 'Буду позже';
        $bot->sendMessage($chatId, $questions['be_later']['q1']);
        $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
            $message = $update->getMessage();
            $messageText['q1'] = $message->getText();
            $bot->sendMessage($chatId, $questions['be_later']['q2']);
            $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
                $message = $update->getMessage();
                $messageText['q2'] = $message->getText();
                $bot->sendMessage($chatId, $questions['be_later']['q3']);
                $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
                    $message = $update->getMessage();
                    $messageText['q3'] = $message->getText();
                    $bot->sendMessage($chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' . mb_convert_encoding('&#x1F49B;', 'UTF-8', 'HTML-ENTITIES'));
                    $finalMessage = "<b>{$messageText['title']}</b>\n"
                        . "&#x1F464; Имя - {$messageText['q1']}\n"
                        . "&#x23F0; Будет в офисе - {$messageText['q2']}\n"
                        . "&#x2753; Причина - {$messageText['q3']}";
                    $bot->sendMessage($groupChatId, $finalMessage, 'HTML');
                });
            });
        });
    } elseif ($data === '/pain') {
        $messageText['title'] = 'Заболел';
        $bot->sendMessage($chatId, $questions['pain']['q1']);
        $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
            $message = $update->getMessage();
            $messageText['q1'] = $message->getText();
            $bot->sendMessage($chatId, 'Выздоравливай скорее! Не забудь сообщить своему непосредственному руководителю и взять больничный :)');
            $finalMessage = "<b>{$messageText['title']}</b>\n"
                . "&#x1F464; Имя - {$messageText['q1']}";
            $bot->sendMessage($groupChatId, $finalMessage, 'HTML');
        });
    } elseif ($data === '/vacation') {
        $messageText['title'] = 'В отпуске';
        $bot->sendMessage($chatId, $questions['vacation']['q1']);
        $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
            $message = $update->getMessage();
            $messageText['q1'] = $message->getText();
            $bot->sendMessage($chatId, $questions['vacation']['q2']);
            $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
                $message = $update->getMessage();
                $messageText['q2'] = $message->getText();
                $bot->sendMessage($chatId, 'Хорошего отпуска! Ждем в офисе ' . mb_convert_encoding('&#x1F49B;', 'UTF-8', 'HTML-ENTITIES'));
                $finalMessage = "<b>{$messageText['title']}</b>\n"
                    . "&#x1F464; Имя - {$messageText['q1']}\n"
                    . "&#x1F4C5; Даты - {$messageText['q2']}";
                $bot->sendMessage($groupChatId, $finalMessage, 'HTML');
            });
        });
    } elseif ($data === '/business_trip') {
        $messageText['title'] = 'Командировка';
        $bot->sendMessage($chatId, $questions['business_trip']['q1']);
        $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
            $message = $update->getMessage();
            $messageText['q1'] = $message->getText();
            $bot->sendMessage($chatId, $questions['business_trip']['q2']);
            $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
                $message = $update->getMessage();
                $messageText['q2'] = $message->getText();
                $bot->sendMessage($chatId, $questions['business_trip']['q3']);
                $bot->on(function ($update) use ($bot, $chatId, &$messageText) {
                    $message = $update->getMessage();
                    $messageText['q3'] = $message->getText();
                    $bot->sendMessage($chatId, 'Удачной командировки! Ждем в офисе ' . mb_convert_encoding('&#x1F49B;', 'UTF-8', 'HTML-ENTITIES'));
                    $finalMessage = "<b>{$messageText['title']}</b>\n"
                        . "&#x1F464; Имя - {$messageText['q1']}\n"
                        . "&#x1F30D; Город - {$messageText['q2']}\n"
                        . "&#x1F4C5; Даты - {$messageText['q3']}";
                    $bot->sendMessage($groupChatId, $finalMessage, 'HTML');
                });
            });
        });
    }
});

// Список команд
$commands = [
    ['command' => '/start', 'description' => 'Старт'],
    ['command' => '/weekend', 'description' => 'День за свой счет'],
    ['command' => '/distant', 'description' => 'На удаленке'],
    ['command' => '/late', 'description' => 'Опаздываю'],
    ['command' => '/be_later', 'description' => 'Буду позже'],
    ['command' => '/pain', 'description' => 'Заболел'],
    ['command' => '/vacation', 'description' => 'В отпуске'],
    ['command' => '/business_trip', 'description' => 'Командировка'],
];

// Список вопросов
$questions = [
    'weekend' => [
        'q1' => 'Представься, пожалуйста!',
        'q2' => 'Сколько дней ты берешь за свой счет?'
    ],
    'distant' => [
        'q1' => 'Представься, пожалуйста!',
        'q2' => 'Сколько дней ты будешь на удаленке?'
    ],
    'late' => [
        'q1' => 'Представься, пожалуйста!',
        'q2' => 'На сколько ты опаздываешь? (укажи время в минутах/часах)',
        'q3' => 'Подскажи, пожалуйста, почему опаздываешь'
    ],
    'be_later' => [
        'q1' => 'Представься, пожалуйста!',
        'q2' => 'В какое время ты планируешь быть в офисе?',
        'q3' => 'Укажи, пожалуйста, причину (Если встреча, то укажи клиента)',
    ],
    'pain' => [
        'q1' => 'Представься, пожалуйста!',
    ],
    'vacation' => [
        'q1' => 'Представься, пожалуйста!',
        'q2' => 'Пожалуйста, напиши даты отпуска в формате дд.мм-дд.мм',
    ],
    'business_trip' => [
        'q1' => 'Представься, пожалуйста!',
        'q2' => 'Пожалуйста, напиши даты командировки в формате дд.мм-дд.мм',
    ],
];

// $bot->run();
?>