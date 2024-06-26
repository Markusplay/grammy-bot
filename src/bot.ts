import { Bot } from 'grammy'

const token = '7485330945:AAEiOKQr5c3wg7kpY17tCR2C5eyw5dm9vR4';

export const bot = new Bot(token)

const supportChatId = '-1002013473991';


// Initialize in-memory storage
const forwardedMessages:Record<string, any> = {};

bot.command('start', (ctx) => {
    ctx.reply('Привіт! Як я можу вам допомогти 4?');
});

bot.on('message', async (ctx) => {
    const userId = ctx.from.id;
    const userChatId = ctx.chat.id;
    const messageId = ctx.message.message_id;

    if (userChatId.toString() !== supportChatId.toString()) {
        forwardedMessages[messageId] = {userChatId}

        await bot.api.sendMessage(supportChatId,  `Запит #T${userId} від @${ctx.from.username}\n`)
        await bot.api.sendMessage(supportChatId,  JSON.stringify(forwardedMessages))
        await bot.api.forwardMessage(supportChatId, userChatId, messageId);
    }
});

bot.on('message', (ctx) => {
    bot.api.sendMessage(supportChatId, `supportChatId.toString() ${supportChatId.toString()}`);
    bot.api.sendMessage(supportChatId, `ctx.chat.id.toString() ${ctx.chat.id.toString()}`);
    if (ctx.chat.id.toString() === supportChatId.toString()) {
        bot.api.sendMessage(supportChatId, "I see support chat");
        
        const repliedToMessageId = ctx.message.reply_to_message?.message_id;
        const forwardedMessageInfo = forwardedMessages[repliedToMessageId || ''];
        bot.api.sendMessage(supportChatId, JSON.stringify(forwardedMessageInfo));

        if (forwardedMessageInfo) {
            bot.api.sendMessage(forwardedMessageInfo.userChatId, `Відповідь від підтримки на ваш запит:\n${ctx.message}`);
        }
    }
});

// Start the bot
bot.start();