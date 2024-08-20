require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const token = process.env.TELEGRAM_BOT_TOKEN;
const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log('Server running');
});
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  console.log(`Received /echo command: ${match[1]}`);
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp).catch((error) => {
    console.error('Error sending /echo message:', error);
  });
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot
      .sendMessage(chatId, 'Open the website', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Open',
                web_app: { url: 'https://horoscope-miniapp-upp1.vercel.app' },
              },
            ],
          ],
        },
      })
      .catch((error) => {
        console.error('Error sending start message:', error);
      });
  }
});
