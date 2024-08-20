require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const token = process.env.TELEGRAM_BOT_TOKEN;
const url = process.env.APP_URL;
const port = process.env.PORT || 3000;

const encodedToken = encodeURIComponent(token);
console.log(encodedToken);
const bot = new TelegramBot(token, {
  webHook: {
    port: port,
  },
});

bot
  .deleteWebHook()
  .then(() => {
    console.log('Webhook deleted');
    return bot.setWebHook(`${url}/bot${encodedToken}`);
  })
  .then(() => {
    console.log('Webhook set');
  })
  .catch((error) => {
    console.error('Error setting webhook:', error);
  });

app.post(`/bot${encodedToken}`, (req, res) => {
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
