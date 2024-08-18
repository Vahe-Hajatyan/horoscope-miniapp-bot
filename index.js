const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
const token = '7430822939:AAGEJEAUk1By-kK2TW1Xpn_jTciNIsvyO9Q';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text === '/start') {
    await bot.sendMessage(chatId, 'open web site', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'open web site',
              web_app: { url: 'https://horoscope-miniapp-upp1.vercel.app' },
            },
          ],
        ],
      },
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('server started');
});
