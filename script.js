const fs = require('fs');
const path = require('path');
const TelegramApi = require('node-telegram-bot-api');
const { send } = require('process');
const token = '5980630603:AAH3ikiRkcAP3qVpKjZA9mfh1IC95pHGxVk'; /*  5902147445:AAHWNw8KGhaH3zFnDVm9iw8ETqTeWgg6inQ*/
const bot = new TelegramApi(token, {polling: true});
const GROUP_CHAT_ID = '-1001961186421';
const TEST_GROUP_CHAT_ID = '-740721555';
let users = {};
messageText = {};


fs.readFile(path.resolve('users.json'), (err, data) => {
  if (err) throw err;
  users = JSON.parse(data);
});

const commandsBot = bot.setMyCommands ([
  { command: '/start', description: 'Старт' },
]);

const commandsKeyboard = [
  [
      { text: 'Буду позже', callback_data: 'Буду позже' },
      { text: 'Опаздываю', callback_data: 'Опаздываю' },
      { text: 'Заболел', callback_data: 'Заболел' }
  ],
  [
      { text: 'На удаленке', callback_data: 'На удаленке' },
      { text: 'Командировка', callback_data: 'Командировка' },
      { text: 'В отпуске', callback_data: 'В отпуске' },
  ],
  [
      { text: 'День за свой счет', callback_data: 'День за свой счет' },
  ]
];
const options = { reply_markup: { inline_keyboard: commandsKeyboard } };

const questions = {
  "Буду позже": [
    "В какое время ты планируешь быть в офисе?",
    "Укажи, пожалуйста, причину (Если встреча, то укажи клиента)"
  ],
  "Опаздываю": [
    "На сколько ты опаздываешь? (укажи время в минутах/часах)",
    "Подскажи, пожалуйста, почему опаздываешь?"
  ],
  "Заболел": [
    "Выздоравливай скорее! Не забудь сообщить своему непосредственному руководителю и взять больничный :)\nКак самочувствие в целом?"
  ],
  "На удаленке": [
    "Сколько дней ты будешь на удаленке?"
  ],
  "Командировка": [
    "Пожалуйста, напиши даты командировки в формате дд.мм-дд.мм"
  ],
  "В отпуске": [
    "Пожалуйста, напиши даты отпуска в формате дд.мм-дд.мм"
  ],
  "День за свой счет": [
    "Сколько дней ты берешь за свой счет?"
  ]
}

// let decline = ['/start']

let userAnswers = {};

// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   if (!userAnswers[chatId]) {
//     if (users[chatId]) {
//       console.log(userAnswers)
//       bot.sendMessage(chatId, `Привет, ${users[chatId]}! О чем расскажешь?`, options)
//     } else {
//       bot.sendMessage(chatId, 'Представься, пожалуйста! Как тебя зовут?\nПришли свои Имя и Фамилию');
//     }  
//   }
// });

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  if (users[chatId]) {
    if (questions.hasOwnProperty(query.data)) {
      userAnswers[chatId] = { category: query.data, answers: [], currentQuestionIndex: 0 };
      askQuestion(chatId);
    }
  } else {
    bot.sendMessage(chatId, 'Нажмите Старт в меню ниже!')
  }
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  if (msg.text === '/start') {
    if (!userAnswers[chatId]) {
      if (users[chatId]) {
        bot.sendMessage(chatId, `Привет, ${users[chatId]}! О чем расскажешь?`, options)
      } else {
        bot.sendMessage(chatId, 'Представься, пожалуйста! Как тебя зовут?\nПришли свои Имя и Фамилию');
      }  
    }
  }
  if (!users[chatId] && msg.text !== '/start') {

    if (/^[A-Za-zА-Яа-яЁё]+\s[A-Za-zА-Яа-яЁё]+$/.test(msg.text)) {
      users[chatId] = msg.text;
      console.log(users)
console.log(path.resolve('users.json'))
      fs.writeFile(path.resolve('users.json'), JSON.stringify(users), (err) => {
          if (err) throw err;
      });
      console.log(`Добавлен новый пользователь - ${users[chatId]}!`)
      bot.sendMessage(chatId, `Привет, ${users[chatId]}!\nВыбери команду:`, options)
    } else {
        bot.sendMessage(chatId, `Просьба ввести Имя и Фамилию`)
    }
  }
  if (userAnswers.hasOwnProperty(chatId)) {
    if (msg.text && msg.text !== '/start') {
      userAnswers[chatId].answers.push(msg.text);
      userAnswers[chatId].currentQuestionIndex++;
    } else {
        bot.sendMessage(chatId, `Просьба текстом`);
        switch (userAnswers[chatId].currentQuestionIndex) {
          case '0':
            userAnswers[chatId].currentQuestionIndex = 0;
            break
          case '1':
            userAnswers[chatId].currentQuestionIndex = 1;
            break
          case '2':
            userAnswers[chatId].currentQuestionIndex = 2;
            break
        }
      }
  }
  
  if (userAnswers[chatId].currentQuestionIndex < questions[userAnswers[chatId].category].length) {
    askQuestion(chatId);
  } else {
    // console.log(userAnswers[chatId].currentQuestionIndex < questions[userAnswers[chatId].category].length)
    let finalMessage;
    
    switch (userAnswers[chatId].category) {
      case "Буду позже":
        finalMessage = `<b>${userAnswers[chatId].category}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${users[chatId]}\n${String.fromCodePoint(0x23F0)} Будет в офисе - ${userAnswers[chatId].answers[0]}\n${String.fromCodePoint(0x2753)} Причина - ${userAnswers[chatId].answers[1]}`;
        break;
      case "Опаздываю":
        finalMessage = `<b>${userAnswers[chatId].category}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${users[chatId]}\n${String.fromCodePoint(0x23F0)} Опаздывает на - ${userAnswers[chatId].answers[0]}\n${String.fromCodePoint(0x2753)} Причина - ${userAnswers[chatId].answers[1]}`;
        break
      case "Заболел":
        finalMessage = `<b>${userAnswers[chatId].category}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${users[chatId]}\n${String.fromCodePoint(0x23F0)} Самочувствие - ${userAnswers[chatId].answers[0]}`;
        break
      case "На удаленке":
        finalMessage = `<b>${userAnswers[chatId].category}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${users[chatId]}\n${String.fromCodePoint(0x23F0)} Дней на удаленке - ${userAnswers[chatId].answers[0]}`;
        break
      case "Командировка":
        finalMessage = `<b>${userAnswers[chatId].category}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${users[chatId]}\n${String.fromCodePoint(0x23F0)} Даты командировки - ${userAnswers[chatId].answers[0]}`;
        break
      case "В отпуске":
        finalMessage = `<b>${userAnswers[chatId].category}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${users[chatId]}\n${String.fromCodePoint(0x23F0)} Даты отпуска - ${userAnswers[chatId].answers[0]}`;
        break
      case "День за свой счет":
        finalMessage = `<b>${userAnswers[chatId].category}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${users[chatId]}\n${String.fromCodePoint(0x23F0)} Дней взял - ${userAnswers[chatId].answers[0]}`;
        break
    }

    bot.sendMessage(chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' + String.fromCodePoint(0x1F49B))
    setTimeout(() => {
      bot.sendMessage(chatId, 'Мы записали твой прошлый ответ. Это окно с выбором понадобится тебе в следующий раз ' + String.fromCodePoint(0x1FAF6), options);
    }, 2000);
    try {
      bot.sendMessage(GROUP_CHAT_ID, finalMessage, {parse_mode: 'HTML'});
      bot.sendMessage(TEST_GROUP_CHAT_ID, finalMessage, {parse_mode: 'HTML'});
    } catch (error) {
      bot.sendMessage(GROUP_CHAT_ID, 'Произошла ошибка, пожалуйста, повтори отправку позже!', {parse_mode: 'HTML'});
      bot.sendMessage(TEST_GROUP_CHAT_ID, 'Произошла ошибка, пожалуйста, повтори отправку позже!', {parse_mode: 'HTML'});
      console.log(error);
    } 
    delete userAnswers[chatId];
  } 
});



function askQuestion(chatId) {
  const question = questions[userAnswers[chatId].category][userAnswers[chatId].currentQuestionIndex];
  bot.sendMessage(chatId, question);
}
