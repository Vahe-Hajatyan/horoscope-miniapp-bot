require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const token = process.env.TELEGRAM_BOT_TOKEN;
const url = process.env.APP_URL;
const port = process.env.PORT || 3000;

const bot = new TelegramBot(token, {
  webHook: {
    port: port,
  },
});

bot
  .setWebHook(`${url}/bot${token}`)
  .then(() => {
    console.log('Webhook set');
  })
  .catch((error) => {
    console.error('Error setting webhook:', error);
  });

app.use(`/bot${token}`, (req, res) => {
  console.log('Received request for webhook');
  res.send('Webhook received');
});

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

  console.log(`Received message: ${text}`);
  if (text === '/start') {
    await bot
      .sendMessage(chatId, 'Open the website', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Open Website',
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
