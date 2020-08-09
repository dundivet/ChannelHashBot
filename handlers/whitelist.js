'use strict';

require(`dotenv`).config();
const 
    { Telegram, Extra } = require(`telegraf`),
    telegram = new Telegram(process.env.BOT_TOKEN),
    bot_admin = process.env.BOT_ADMIN;

module.exports = (bot, db) => {
    bot.command(`whitelist`, ctx => {
        if (ctx.chat.type.includes(`private`) && ctx.from.id != bot_admin) return;

        const { message_id, text, entities } = ctx.message;
        const groups = text.split(` `);

        if (groups.length > 1) {
            for (let i = 1; i < groups.length; i++) {
                const grp = groups[i];
                telegram.getChat(`${grp}`).then(g => {
                    if (g.type.includes(`group`,`supergroup`)) {
                        db.whitelist.find({ chat_id: g.id }, async (err, doc) => {
                            if(err) { 
                                console.log(err);
                                return;
                            }
                            
                            if (doc.length > 0) {
                                ctx.reply(
                                    `Ya el grupo <b>${g.title}</b> se encuentra en lista blanca.`, 
                                    { parse_mode: `html` }
                                );
                                return;
                            }

                            db.whitelist.insert({
                                chat_id: g.id,
                                username: g.username,
                                type: g.type,
                                title: g.title,
                            }, async (err, newDocs) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
        
                                ctx.reply(
                                    `Se ha salvado el grupo <b>${g.title}</b> de forma satisfactoria en lista blanca.`, 
                                    { parse_mode: `html` }
                                );
                            });
                        });
                    }
                });
            }
        } else {
            db.whitelist.find({}, async (err, docs) => {
                const groups = docs.map(g => g.title).join(`, `);
                ctx.reply(`<b>Grupos en lista blanca:</b> ${groups}`, { parse_mode: `html` });
            });
        }
    });
};
