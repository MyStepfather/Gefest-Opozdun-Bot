const fs = require('fs');
const TelegramApi = require('node-telegram-bot-api');
const token = '5980630603:AAH3ikiRkcAP3qVpKjZA9mfh1IC95pHGxVk';
const bot = new TelegramApi(token, {polling: true});
const groupChatId = -740721555;

const usersFile = 'users.json';
let users = {};
let userCount = 1;
let msgDel = [];

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
const options = { reply_markup: { inline_keyboard: commandsKeyboard } };

const restartButton = [
  [{ text: 'Старт', callback_data: '/start' }]
];
const restart = { reply_markup: { inline_keyboard: restartButton } };


const messageText = {};
let step = '';

if (fs.existsSync(usersFile)) {
  users = JSON.parse(fs.readFileSync(usersFile));
  userCount = Object.keys(users).length + 1;
}

function addUser(userId, userName) {
  let user = {
      userId: userId,
      user_name: userName,
      messages_id: []
  };
  users[`user_${userCount}`] = user;
  userCount++;
  fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
      if (err) throw err;
      console.log('User added to file');
  });
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  let step = msg.message_id;
  msgDel.push(step);
  console.log(users)
  for (let userKey in users) {
    if (users[userKey].userId === userId) {
      step = bot.sendMessage(chatId, `Привет, ${users[userKey].user_name}! Выбери команду:`, options);
      msgDel.push(step.message_id);
      // console.log(msgDel);
      for (let i=0; i<msgDel.length; i++) {
        users[userKey].messages_id.push(msgDel[i]);
      }
      fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
        if (err) throw err;
      });
      // console.log(users[userKey]);
      break;
    } else {
      step = await bot.sendMessage(chatId, 'Привет! Как тебя зовут? Напиши свои Имя и Фамилию =)');
      msgDel.push(step.message_id);
  
      bot.once('message', async (msg) => {
        const userId = msg.from.id;
        let userName = msg.text;
        step = msg.message_id;
        msgDel.push(step);
        if (!userName.startsWith('/')) {
          addUser(userId, userName);
          step = await bot.sendMessage(chatId, `Привет, ${userName}! Выбери команду:`, options);
          msgDel.push(step.message_id);
          for (let userKey in users) {
            if (users[userKey].userId === userId) {
              for (let i=0; i<msgDel.length; i++) {
                users[userKey].messages_id.push(msgDel[i]);
              }
              console.log(users[userKey]);
              fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
                if (err) throw err;
              });
            }
          }
        }
      });
    }
  }
});

// Обработчик нажатия на кнопки
bot.on('callback_query', async (query) => {
  const userId = query.from.id;
  // JSON.parse(fs.readFileSync(usersFile));
  for (let userKey in users) {
    if (users[userKey].userId === userId) {
      const chatId = query.message.chat.id;
      const command = query.data;
      const commandDescription = commands.find((c) => c.command === command).description;
      messageText.title = commandDescription;
      messageText['userName'] = users[userKey].user_name;
      // console.log(msgDel)
      users[userKey].messages_id
    
      if (query.data === '/weekend') {
        console.log(msgDel);
        step = await bot.sendMessage(chatId, `${questions.weekend.q1}`);
        users[userKey].messages_id.push(step.message_id);
        bot.once('message', async (msg) => {
          messageText['q1'] = msg.text;
          step = msg.message_id;
          users[userKey].messages_id.push(step);
          step = await bot.sendMessage(chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' + String.fromCodePoint(0x1F49B))
          // console.log(step);
          users[userKey].messages_id.push(step.message_id);
          let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}\n${String.fromCodePoint(0x2753)} Дней взял - ${messageText.q1}`
          await bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'});
          // bot.sendMessage(chatId, 'Отправить снова', restart)
          
          users[userKey].messages_id.forEach((del) => {
            console.log(del);
            bot.deleteMessage(chatId, del);
          
          })
          users[userKey].messages_id = [];
          msgDel = [];

        });
    
      } else if (query.data === '/distant') {
          bot.sendMessage(chatId, `${questions.distant.q1}`);
          bot.once('message', (msg) => {
            messageText['q1'] = msg.text;
            bot.sendMessage(chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' + String.fromCodePoint(0x1F49B))
            let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}\n${String.fromCodePoint(0x2753)} Дней на удаленке - ${messageText.q1}`
            bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'})
          });
    
      } else if (query.data === '/late') {
          bot.sendMessage(chatId, `${questions.late.q1}`);
          bot.once('message', (msg) => {
            messageText['q1'] = msg.text;
        
            bot.sendMessage(chatId, `${questions.late.q2}`);
            bot.once('message', (msg) => {
              messageText['q2'] = msg.text;
              bot.sendMessage(chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' + String.fromCodePoint(0x1F49B));
              let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}\n${String.fromCodePoint(0x23F0)} Опаздывает на - ${messageText.q1}\n${String.fromCodePoint(0x2753)} Причина - ${messageText.q2}`
              bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'});
            });
          });
    
      } else if (query.data === '/be_later') {
        bot.sendMessage(chatId, `${questions.be_later.q1}`);
        bot.once('message', (msg) => {
          messageText['q1'] = msg.text;
      
          bot.sendMessage(chatId, `${questions.be_later.q2}`);
          bot.once('message', (msg) => {
            messageText['q2'] = msg.text;
            bot.sendMessage(chatId, 'Мы передали твой ответ Кате Царьковой и Алене Костиной. Ждем в офисе ' + String.fromCodePoint(0x1F49B))
            let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}\n${String.fromCodePoint(0x23F0)} Будет в офисе - ${messageText.q1}\n${String.fromCodePoint(0x2753)} Причина - ${messageText.q2}`
            bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'});
          });
        });
    
      } else if (query.data === '/pain') {
          bot.sendMessage(chatId, 'Выздоравливай скорее! Не забудь сообщить своему непосредственному руководителю и взять больничный :)'/*  + String.fromCodePoint(0x1F49B) */);
          let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}`;
          bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'});
    
      } else if (query.data === '/vacation') {
        bot.sendMessage(chatId, `${questions.vacation.q1}`);
        bot.once('message', (msg) => {
          messageText['q1'] = msg.text;
          bot.sendMessage(chatId, 'Хорошего отпуска! Ждем в офисе ' + String.fromCodePoint(0x1F49B));
          let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}\n${String.fromCodePoint(0x2753)} Даты отпуска - ${messageText.q1}`;
          bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'});
        });
    
      } else if (query.data === '/business_trip') {
        bot.sendMessage(chatId, `${questions.business_trip.q1}`);
        bot.once('message', (msg) => {
          messageText['q1'] = msg.text;
          bot.sendMessage(chatId, 'Хорошей командировки! Ждем в офисе ' + String.fromCodePoint(0x1F49B));
          let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}\n${String.fromCodePoint(0x2753)} Даты командировки - ${messageText.q1}`;
          bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'});
        });
      }
    }
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
    q1: 'Сколько дней ты берешь за свой счет?'
  },
  distant: {
    q1: 'Сколько дней ты будешь на удаленке?'
  },
  late: {
    q1: 'На сколько ты опаздываешь? (укажи время в минутах/часах)',
    q2: 'Подскажи, пожалуйста, почему опаздываешь'
  },
  be_later: {    
    q1: 'В какое время ты планируешь быть в офисе?',
    q2: 'Укажи, пожалуйста, причину (Если встреча, то укажи клиента)'
  },
  pain: {
    // q1: 'Представься, пожалуйста!',
  },
  vacation: {
    q1: 'Пожалуйста, напиши даты отпуска в формате дд.мм-дд.мм',
  },
  business_trip: {
    q1: 'Пожалуйста, напиши даты командировки в формате дд.мм-дд.мм',
  }
};