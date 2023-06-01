const fs = require('fs');
const TelegramApi = require('node-telegram-bot-api');
const { send } = require('process');
const token = '5980630603:AAH3ikiRkcAP3qVpKjZA9mfh1IC95pHGxVk';
const bot = new TelegramApi(token, {polling: true});
const GROUP_CHAT_ID = '-740721555';
let users = {};
messageText = {};


fs.readFile('users.json', (err, data) => {
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

let userAnswers = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  if (users[chatId]) {
    bot.sendMessage(chatId, `Привет, ${users[chatId]}! О чем расскажешь?`, options)
  } else {
    bot.sendMessage(chatId, 'Представься, пожалуйста! Как тебя зовут?\nПришли свои Имя и Фамилию');
  }  
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  if (questions.hasOwnProperty(query.data)) {
    userAnswers[chatId] = { category: query.data, answers: [], currentQuestionIndex: 0 };
    askQuestion(chatId);
  }
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (!users[chatId] && msg.text !== '/start'  ) {
    users[chatId] = msg.text;
    fs.writeFile('users.json', JSON.stringify(users), (err) => {
        if (err) throw err;
    });
    bot.sendMessage(chatId, `Привет, ${msg.text}!\nВыбери команду:`, options)
  }
  
  if (userAnswers.hasOwnProperty(chatId)) {
    userAnswers[chatId].answers.push(msg.text);
    userAnswers[chatId].currentQuestionIndex++;
    
    if (userAnswers[chatId].currentQuestionIndex < questions[userAnswers[chatId].category].length) {
      askQuestion(chatId);
    } else {
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
        bot.sendMessage(chatId, 'Мы записали ваш прошлый ответ. Это окно с выбором понадобится вам в следующий раз ' + String.fromCodePoint(0x1FAF6), options);
      }, 2000); 
      bot.sendMessage(GROUP_CHAT_ID, finalMessage, {parse_mode: 'HTML'});

      delete userAnswers[chatId];
    }
  }
});

function askQuestion(chatId) {
  const question = questions[userAnswers[chatId].category][userAnswers[chatId].currentQuestionIndex];
  
  bot.sendMessage(chatId, question);
}



// fs.readFile('users.json', (err, data) => {
//     if (err) throw err;
//     users = JSON.parse(data);
// });

// // Клавиатура с командами
// const commandsKeyboard = [
//     [
//         { text: 'Буду позже', callback_data: '/be_later' },
//         { text: 'Опаздываю', callback_data: '/late' },
//         { text: 'Заболел', callback_data: '/pain' }
//     ],
//     [
//         { text: 'На удаленке', callback_data: '/distant' },
//         { text: 'Командировка', callback_data: '/business_trip' },
//         { text: 'В отпуске', callback_data: '/vacation' },
//     ],
//     [
//         { text: 'День за свой счет', callback_data: '/weekend' },
//     ]
// ];
// const options = { reply_markup: { keyboard: commandsKeyboard } };

// bot.onText(/\/start/, async (msg) => {
//     const chatId = msg.chat.id;
//     if (users[chatId]) {
//         await bot.sendMessage(chatId, `Привет, ${users[chatId]}!`, options)
//     } else {
//         await bot.sendMessage(chatId, 'Как тебя зовут?');
//     }
// });


// bot.on('message', async (msg) => {
//     // console.log(msg)
//     const chatId = msg.chat.id;
//     if (!users[chatId] && msg.text !== '/start'  ) {
//         users[chatId] = msg.text;
//         fs.writeFile('users.json', JSON.stringify(users), (err) => {
//             if (err) throw err;
//         });
//         await bot.sendMessage(chatId, `Привет, ${msg.text}!`, options)
//     }
//     console.log(msg.text)
// });

// bot.onText(/Буду позже/, async (msg) => {
//   const chatId = msg.chat.id;
//   messageText['title'] = msg.text;
//   await bot.sendMessage(chatId, `${questions.be_later.q1}`);
// });


// const fs = require('fs');
// const TelegramApi = require('node-telegram-bot-api');
// const token = '5980630603:AAH3ikiRkcAP3qVpKjZA9mfh1IC95pHGxVk';
// const bot = new TelegramApi(token, {polling: true});
// const groupChatId = -740721555; /* -805376942 */

// const usersFile = 'users.json';
// let users = {};
// if (fs.existsSync(usersFile)) {
//   users = JSON.parse(fs.readFileSync(usersFile));
// }


// // Клавиатура с командами
// const commandsKeyboard = [
//   [
//     // { text: 'Старт', callback_data: '/start' },
//     { text: 'День за свой счет', callback_data: '/weekend' },
//     { text: 'На удаленке', callback_data: '/distant' },
//   ],
//   [
//     { text: 'Буду позже', callback_data: '/be_later' },
//     { text: 'Опаздываю', callback_data: '/late' },
//   ],
//   [
//     { text: 'Командировка', callback_data: '/business_trip' },
//     { text: 'В отпуске', callback_data: '/vacation' },
//     { text: 'Заболел', callback_data: '/pain' }
//   ]
// ];
// const options = { reply_markup: { inline_keyboard: commandsKeyboard } };

// const restartButton = [
//   [{ text: 'Старт', callback_data: '/start' }]
// ];
// const restart = { reply_markup: { inline_keyboard: restartButton } };


// const messageText = {};

// bot.onText(/\/start/, async (msg) => {
//   const chatId = msg.chat.id;
//   const userId = msg.from.id;

//   if (users[userId]) {
//     messageText['userName'] = users[userId];
//     await bot.sendMessage(chatId, `Привет, ${users[userId]}! Выбери команду:`, options);

//   } else {
//       await bot.sendMessage(chatId, 'Привет! Как тебя зовут? Напиши свои Имя и Фамилию =)');
//       bot.once('message', async (msg_name) => {
//         if (msg_name.from.id == msg.from.id) {
//           if (!msg_name.text.startsWith('/') && !users[userId]) {
//             users[userId] = msg_name.text;
//             messageText['userName'] = msg_name.text;
//             fs.writeFileSync(usersFile, JSON.stringify(users));
//             await bot.sendMessage(msg_name.chat.id, `Привет, ${users[userId]}! Выбери команду:`, options);
//           }
//         } else {
//             await bot.sendMessage(chatId, 'Повтори, нажми еще раз СТАРТ, пожалуйста' + String.fromCodePoint(0x1F49B))
//           }
          
//       });
//     }
// });


// // Обработчик нажатия на кнопки
// bot.on('callback_query', (query) => {
//   const chatId = query.message.chat.id;
//   const command = query.data;
//   const userId = query.from.id;
//   const commandDescription = commands.find((c) => c.command === command).description;
//   messageText.title = commandDescription;
//   messageText['userName'] = users[userId];


//   if (query.data === '/weekend') {
//     bot.sendMessage(chatId, `${questions.weekend.q1}`);
//     bot.once('message', (msg) => {
//       if (userId == msg.from.id) {
//         messageText['q1'] = msg.text;
//         bot.sendMessage(chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' + String.fromCodePoint(0x1F49B))
//         let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}\n${String.fromCodePoint(0x2753)} Дней взял - ${messageText.q1}`
//         bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'});
//         setTimeout(() => {
//           bot.sendMessage(chatId, 'Мы записали ваш прошлый ответ. Это окно с выбором понадобится вам в следующий раз' + String.fromCodePoint(0x1FAF6), options);
//         }, 2000);  
//       } else {
//         bot.sendMessage(chatId, 'Очень извиняемся! Выберите команду еще раз ' + String.fromCodePoint(0x1F49B), options)
//       }
//     });

//   } else if (query.data === '/distant') {
//       bot.sendMessage(chatId, `${questions.distant.q1}`);
//       bot.once('message', (msg) => {
//         if (userId == msg.from.id) {
//           messageText['q1'] = msg.text;
//           bot.sendMessage(chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' + String.fromCodePoint(0x1F49B))
//           let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}\n${String.fromCodePoint(0x2753)} Дней на удаленке - ${messageText.q1}`
//           bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'})
//           setTimeout(() => {
//             bot.sendMessage(chatId, 'Мы записали ваш прошлый ответ. Это окно с выбором понадобится вам в следующий раз' + String.fromCodePoint(0x1FAF6), options);
//           }, 2000);  
//         } else {
//           bot.sendMessage(chatId, 'Очень извиняемся! Выберите команду еще раз ' + String.fromCodePoint(0x1F49B), options)
//         }
//       });

//   } else if (query.data === '/late') {
//       bot.sendMessage(chatId, `${questions.late.q1}`);
//       bot.once('message', (msg) => {

//         messageText['q1'] = msg.text;
    
//         bot.sendMessage(chatId, `${questions.late.q2}`);
//         bot.once('message', (msg) => {
//           if (userId == msg.from.id) {
//             messageText['q2'] = msg.text;
//             bot.sendMessage(chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' + String.fromCodePoint(0x1F49B));
//             let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}\n${String.fromCodePoint(0x23F0)} Опаздывает на - ${messageText.q1}\n${String.fromCodePoint(0x2753)} Причина - ${messageText.q2}`
//             bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'});
//             setTimeout(() => {
//               bot.sendMessage(chatId, 'Мы записали ваш прошлый ответ. Это окно с выбором понадобится вам в следующий раз' + String.fromCodePoint(0x1FAF6), options);
//             }, 2000); 
//           } else {
//             bot.sendMessage(chatId, 'Очень извиняемся! Выберите команду еще раз ' + String.fromCodePoint(0x1F49B), options)
//           }
//         });
//       });

//   } else if (query.data === '/be_later') {
//     bot.sendMessage(chatId, `${questions.be_later.q1}`);
//     bot.once('message', (msg) => {
//       messageText['q1'] = msg.text;
  
//       bot.sendMessage(chatId, `${questions.be_later.q2}`);
//       bot.once('message', (msg) => {
//         if (userId == msg.from.id) {
//           messageText['q2'] = msg.text;
//           bot.sendMessage(chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' + String.fromCodePoint(0x1F49B))
//           let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}\n${String.fromCodePoint(0x23F0)} Будет в офисе - ${messageText.q1}\n${String.fromCodePoint(0x2753)} Причина - ${messageText.q2}`
//           bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'});
//           setTimeout(() => {
//             bot.sendMessage(chatId, 'Мы записали ваш прошлый ответ. Это окно с выбором понадобится вам в следующий раз' + String.fromCodePoint(0x1FAF6), options);
//           }, 2000); 
//         } else {
//           bot.sendMessage(chatId, 'Очень извиняемся! Выберите команду еще раз ' + String.fromCodePoint(0x1F49B), options)
//         }
//       });
//     });

//   } else if (query.data === '/pain') {
//       bot.sendMessage(chatId, 'Выздоравливай скорее! Не забудь сообщить своему непосредственному руководителю и взять больничный :)'/*  + String.fromCodePoint(0x1F49B) */);
//       let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}`;
//       bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'});

//   } else if (query.data === '/vacation') {
//     bot.sendMessage(chatId, `${questions.vacation.q1}`);
//     bot.once('message', (msg) => {
//       if (userId == msg.from.id) {
//         messageText['q1'] = msg.text;
//         bot.sendMessage(chatId, 'Хорошего отпуска! Ждем в офисе ' + String.fromCodePoint(0x1F49B));
//         let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}\n${String.fromCodePoint(0x2753)} Даты отпуска - ${messageText.q1}`;
//         bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'});
//         setTimeout(() => {
//           bot.sendMessage(chatId, 'Мы записали ваш прошлый ответ. Это окно с выбором понадобится вам в следующий раз' + String.fromCodePoint(0x1FAF6), options);
//         }, 2000); 
//       } else {
//         bot.sendMessage(chatId, 'Очень извиняемся! Выберите команду еще раз ' + String.fromCodePoint(0x1F49B), options)
//       }
//     });

//   } else if (query.data === '/business_trip') {
//     bot.sendMessage(chatId, `${questions.business_trip.q1}`);
//     bot.once('message', (msg) => {
//       if (userId == msg.from.id) {
//         messageText['q1'] = msg.text;
//         bot.sendMessage(chatId, 'Хорошей командировки! Ждем в офисе ' + String.fromCodePoint(0x1F49B));
//         let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}\n${String.fromCodePoint(0x2753)} Даты командировки - ${messageText.q1}`;
//         bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'});
//         setTimeout(() => {
//           bot.sendMessage(chatId, 'Мы записали ваш прошлый ответ. Это окно с выбором понадобится вам в следующий раз' + String.fromCodePoint(0x1FAF6), options);
//         }, 2000); 
//       } else {
//         bot.sendMessage(chatId, 'Очень извиняемся! Выберите команду еще раз ' + String.fromCodePoint(0x1F49B), options)
//       }
//     });
//   }
// });

// /* bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   const userId = msg.from.id;
  
//   if
//   }
// }); */



// // Список команд
// const commands = [
//   { command: '/start', description: 'Старт' },
//   { command: '/weekend', description: 'День за свой счет' },
//   { command: '/distant', description: 'На удаленке' },
//   { command: '/late', description: 'Опаздываю' },
//   { command: '/be_later', description: 'Буду позже' },
//   { command: '/pain', description: 'Заболел' },
//   { command: '/vacation', description: 'В отпуске' },
//   { command: '/business_trip', description: 'Командировка' },
// ];

// const commandsBot = bot.setMyCommands ([
//   { command: '/start', description: 'Старт' },
// ]);

// // Список вопросов

// const questions = {
//   weekend: {
//     q1: 'Сколько дней ты берешь за свой счет?'
//   },
//   distant: {
//     q1: 'Сколько дней ты будешь на удаленке?'
//   },
//   late: {
//     q1: 'На сколько ты опаздываешь? (укажи время в минутах/часах)',
//     q2: 'Подскажи, пожалуйста, почему опаздываешь'
//   },
//   be_later: {    
//     q1: 'В какое время ты планируешь быть в офисе?',
//     q2: 'Укажи, пожалуйста, причину (Если встреча, то укажи клиента)'
//   },
//   pain: {
//     // q1: 'Представься, пожалуйста!',
//   },
//   vacation: {
//     q1: 'Пожалуйста, напиши даты отпуска в формате дд.мм-дд.мм',
//   },
//   business_trip: {
//     q1: 'Пожалуйста, напиши даты командировки в формате дд.мм-дд.мм',
//   }
// };

// const questions = {
//   weekend: {
//     q1: 'Сколько дней ты берешь за свой счет?'
//   },
//   distant: {
//     q1: 'Сколько дней ты будешь на удаленке?'
//   },
//   late: {
//     q1: 'На сколько ты опаздываешь? (укажи время в минутах/часах)',
//     q2: 'Подскажи, пожалуйста, почему опаздываешь'
//   },
//   be_later: {    
//     q1: 'В какое время ты планируешь быть в офисе?',
//     q2: 'Укажи, пожалуйста, причину (Если встреча, то укажи клиента)'
//   },
//   pain: {
//     // q1: 'Представься, пожалуйста!',
//   },
//   vacation: {
//     q1: 'Пожалуйста, напиши даты отпуска в формате дд.мм-дд.мм',
//   },
//   business_trip: {
//     q1: 'Пожалуйста, напиши даты командировки в формате дд.мм-дд.мм',
//   }
// };