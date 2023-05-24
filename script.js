const TelegramApi = require('node-telegram-bot-api');
const token = '5980630603:AAH3ikiRkcAP3qVpKjZA9mfh1IC95pHGxVk';
const bot = new TelegramApi(token, {polling: true});
const groupChatId = -740721555;

// Клавиатура с командами
const commandsKeyboard = [
  [
    // { text: 'Старт', callback_data: '/start' },
    { text: 'День за свой счет', callback_data: '/weekend' },
    { text: 'На удаленке', callback_data: '/distant' },
  ],
  [
    { text: 'Буду позже', callback_data: '/be_later' },
    { text: 'Опаздываю', callback_data: '/late' },
  ],
  [
    { text: 'Командировка', callback_data: '/business_trip' },
    { text: 'В отпуске', callback_data: '/vacation' },
    { text: 'Заболел', callback_data: '/pain' }
  ]
];

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const messageText = 'Привет! Выберите одну из команд:';
  const options = { reply_markup: { inline_keyboard: commandsKeyboard } };
  bot.sendMessage(chatId, messageText, options);
});

// Обработчик нажатия на кнопки
bot.on('callback_query', (query) => {
  // console.log(query);
  const chatId = query.message.chat.id;
  const command = query.data;
  const commandDescription = commands.find((c) => c.command === command).description;
  const messageText = { title: commandDescription };

  if (query.data === '/weekend') {
    bot.sendMessage(chatId, `${questions.weekend.q1}`);
    bot.once('message', (msg) => {
      messageText['q1'] = msg.text;
  
      bot.sendMessage(chatId, `${questions.weekend.q2}`);
      bot.once('message', (msg) => {
        messageText['q2'] = msg.text;

        bot.sendMessage(chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' + String.fromCodePoint(0x1F49B))
        let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.q1}\n${String.fromCodePoint(0x2753)} Дней взял - ${messageText.q2}`
        bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'})
      });
    });
  } else if (query.data === '/distant') {
      bot.sendMessage(chatId, `${questions.distant.q1}`);
      bot.once('message', (msg) => {
        messageText['q1'] = msg.text;
    
        bot.sendMessage(chatId, `${questions.weekend.q2}`);
        bot.once('message', (msg) => {
          messageText['q2'] = msg.text;

          bot.sendMessage(chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' + String.fromCodePoint(0x1F49B))
          let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.q1}\n${String.fromCodePoint(0x2753)} Дней на удаленке - ${messageText.q2}`
          bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'})
        });
      });
  } else if (query.data === '/late') {
      bot.sendMessage(chatId, `${questions.late.q1}`);
      bot.once('message', (msg) => {
        messageText['q1'] = msg.text;
    
        bot.sendMessage(chatId, `${questions.late.q2}`);
        bot.once('message', (msg) => {
          messageText['q2'] = msg.text;

          bot.sendMessage(chatId, `${questions.late.q3}`);
          bot.once('message', (msg) => {
            messageText['q3'] = msg.text;

            bot.sendMessage(chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' + String.fromCodePoint(0x1F49B))
            let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.q1}\n${String.fromCodePoint(0x23F0)} Опаздывает на - ${messageText.q2}\n${String.fromCodePoint(0x2753)} Причина - ${messageText.q3}`
            bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'})
          });
        });
      });
  } else if (query.data === '/be_later') {
    bot.sendMessage(chatId, `${questions.be_later.q1}`);
    bot.once('message', (msg) => {
      messageText['q1'] = msg.text;
  
      bot.sendMessage(chatId, `${questions.be_later.q2}`);
      bot.once('message', (msg) => {
        messageText['q2'] = msg.text;

        bot.sendMessage(chatId, `${questions.be_later.q3}`);
        bot.once('message', (msg) => {
          messageText['q3'] = msg.text;

          bot.sendMessage(chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' + String.fromCodePoint(0x1F49B))
          let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.q1}\n${String.fromCodePoint(0x23F0)} Будет в офисе - ${messageText.q2}\n${String.fromCodePoint(0x2753)} Причина - ${messageText.q3}`
          bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'})
        });
      });
    });
  } else if (query.data === '/pain') {
    bot.sendMessage(chatId, `${questions.pain.q1}`);
    bot.once('message', (msg) => {
      messageText['q1'] = msg.text;
  
      bot.sendMessage(chatId, 'Выздоравливай скорее! Не забудь сообщить своему непосредственному руководителю и взять больничный :)'/*  + String.fromCodePoint(0x1F49B) */)
      let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.q1}`
      bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'})
    });
  } else if (query.data === '/vacation') {
    bot.sendMessage(chatId, `${questions.vacation.q1}`);
    bot.once('message', (msg) => {
      messageText['q1'] = msg.text;
  
      bot.sendMessage(chatId, `${questions.vacation.q2}`);
      bot.once('message', (msg) => {
        messageText['q2'] = msg.text;

        bot.sendMessage(chatId, 'Хорошего отпуска! Ждем в офисе ' + String.fromCodePoint(0x1F49B))
        let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.q1}\n${String.fromCodePoint(0x2753)} Даты отпуска - ${messageText.q2}`
        bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'})
      });
    });
  } else if (query.data === '/business_trip') {
    bot.sendMessage(chatId, `${questions.business_trip.q1}`);
    bot.once('message', (msg) => {
      messageText['q1'] = msg.text;
  
      bot.sendMessage(chatId, `${questions.business_trip.q2}`);
      bot.once('message', (msg) => {
        messageText['q2'] = msg.text;

        bot.sendMessage(chatId, 'Хорошей командировки! Ждем в офисе ' + String.fromCodePoint(0x1F49B))
        let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.q1}\n${String.fromCodePoint(0x2753)} Даты командировки - ${messageText.q2}`
        bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'})
      });
    });
  }
});

// Список команд
const commands = [
  { command: '/start', description: 'Старт' },
  { command: '/weekend', description: 'День за свой счет' },
  { command: '/distant', description: 'На удаленке' },
  { command: '/late', description: 'Опаздываю' },
  { command: '/be_later', description: 'Буду позже' },
  { command: '/pain', description: 'Заболел' },
  { command: '/vacation', description: 'В отпуске' },
  { command: '/business_trip', description: 'Командировка' },
];

const commandsBot = bot.setMyCommands ([
  { command: '/start', description: 'Старт' },
]);

// Список вопросов

const questions = {
  weekend: {
    q1: 'Представься, пожалуйста!',
    q2: 'Сколько дней ты берешь за свой счет?'
  },
  distant: {
    q1: 'Представься, пожалуйста!',
    q2: 'Сколько дней ты будешь на удаленке?'
  },
  late: {
    q1: 'Представься, пожалуйста!',
    q2: 'На сколько ты опаздываешь? (укажи время в минутах/часах)',
    q3: 'Подскажи, пожалуйста, почему опаздываешь'
  },
  be_later: {    
    q1: 'Представься, пожалуйста!',
    q2: 'В какое время ты планируешь быть в офисе?',
    q3: 'Укажи, пожалуйста, причину (Если встреча, то укажи клиента)',
  },
  pain: {
    q1: 'Представься, пожалуйста!',
  },
  vacation: {
    q1: 'Представься, пожалуйста!',
    q2: 'Пожалуйста, напиши даты отпуска в формате дд.мм-дд.мм',
  },
  business_trip: {
    q1: 'Представься, пожалуйста!',
    q2: 'Пожалуйста, напиши даты командировки в формате дд.мм-дд.мм',
  }
};