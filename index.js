require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const token = process.env.TELEGRAM_BOT_TOKEN;
const port = process.env.PORT || 3000;
const appUrl = process.env.APP_URL;

const webhookUrl = `${appUrl}/webhook`;

const bot = new TelegramBot(token);
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

bot
  .setWebHook(webhookUrl)
  .then(() => {
    console.log('Webhook успешно установлен');
  })
  .catch((error) => {
    console.error('Ошибка при установке вебхука:', error);
  });
app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
app.get('/', (req, res) => {
  res.send('Hello, World!');
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
