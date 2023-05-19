const TelegramApi = require('node-telegram-bot-api');
const token = '5980630603:AAH3ikiRkcAP3qVpKjZA9mfh1IC95pHGxVk';
const bot = new TelegramApi(token, {polling: true});


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(msg);
/*     const { first_name, last_name } = msg.from;
    const messageText = `${first_name} ${last_name}: ${msg.text}`;
    bot.sendMessage(chatId, messageText); */
});
