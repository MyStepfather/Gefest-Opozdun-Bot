const TelegramApi = require('node-telegram-bot-api');
const token = '5980630603:AAH3ikiRkcAP3qVpKjZA9mfh1IC95pHGxVk';
const bot = new TelegramApi(token, {polling: true});
const groupChatId = -740721555;

bot.setMyCommands([
    {command: '/start', description: 'Опаздываю'}
  ]);
  
  let messageText = {
    title: "Новый опозднун!",
    name: '',
    reason: '',
    time: '',
    emoji: String.fromCodePoint(0x263A)
  };
  
  let step = '';
  
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
  
    if (text === '/start') {
      await bot.sendMessage(chatId, "Ваши имя и фамилия");
      step = 'name';
    } else if (step === 'name') {
      messageText.name = text;
      await bot.sendMessage(chatId, "Причина опоздания");
      step = 'reason';
    } else if (step === 'reason') {
      messageText.reason = text;
      await bot.sendMessage(chatId, "На сколько опаздываете?");
      step = 'time';
    } else if (step === 'time') {
      messageText.time = text;
      step = '';
      let finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.name}\n${String.fromCodePoint(0x2753)} Причина - ${messageText.reason}\n${String.fromCodePoint(0x23F0)} Опаздывает на - ${messageText.time}`
      await bot.sendMessage(chatId, 'Ваше сообщение отправлено Костиной А. и Царьковой Е. ' + String.fromCodePoint(0x263A))
      await bot.sendMessage(groupChatId, finalMessage, {parse_mode: 'HTML'})
    }
  });

