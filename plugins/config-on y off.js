import { db } from '../lib/postgres.js'
import { getSubbotConfig } from '../lib/postgres.js'

const handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
const isEnable = /true|включить|(turn)?on|1/i.test(command)
const type = (args[0] || '').toLowerCase()
const chatId = m.chat
const botId = conn.user?.id
const cleanId = botId.replace(/:\d+/, '');
const isSubbot = botId !== 'main'
let isAll = false, isUser = false
let res = await db.query('SELECT * FROM group_settings WHERE group_id = $1', [chatId]);
let chat = res.rows[0] || {};
const getStatus = (flag) => m.isGroup ? (chat[flag] ? '✅' : '❌') : '⚠️';

let menu = `*『 ⧼⧼⧼ ＣＯＮＦＩＧＵＲＡＣＩＯ́Ｎ ⧽⧽⧽ 』*\n\n`;
menu += `> *Seleccione una opción de la lista*\n> *Para empezar a Configurar*\n\n`;
menu += `● *Avisos de la Configuracion:*
✅ ⇢ *Функция Включена*
❌ ⇢ *Функция Отключена*
⚠️ ⇢ *Этот чат не является группой*\n\n`;
menu += `*『 КОМАНДЫ ДЛЯ АДМИНА 』*\n\n`;
menu += `🎉 ПРИВЕТСТВИЕ ${getStatus('welcome')}\n• Mensaje de bienvenida\n• ${usedPrefix + command} welcome\n\n`;
menu += `📣 АКТИВНОСТЬ ${getStatus('detect')}\n• Уведомлять об изменениях в группе\n• ${usedPrefix + command} detect\n\n`;
menu += `🔗 АНТИССЫЛКА ${getStatus('antilink')}\n• Detectar enlaces de grupo\n• ${usedPrefix + command} antilink\n\n`;
menu += `🌐 АНТИССЫЛКА2 ${getStatus('antilink2')}\n• Detectar cualquier link\n• ${usedPrefix + command} antilink2\n\n`;
menu += `🕵️ ANTIFAKE ${getStatus('antifake')}\n• Bloquear números de otros países\n• ${usedPrefix + command} antifake\n\n`;
menu += `🔞 NSFW ${getStatus('modohorny')}\n• Contenido +18 en stickers/gifs\n• ${usedPrefix + command} modohorny\n\n`
menu += `🔒 ТОЛЬКО АДМИН ${getStatus('modoadmin')}\n• Solo admins pueden usar comandos\n• ${usedPrefix + command} modoadmin\n\n`;
  
menu += `\n*『 ФУНКЦИИ ДЛЯ ВЛАДЕЛЬЦА 』*\n\n`;
menu += `🚫 АНТИЛИЧКА ${isSubbot ? (getSubbotConfig(botId).antiPrivate ? '✅' : '❌') : '⚠️'}
• Bloquear uso en privado
• ${usedPrefix + command} antiprivate\n\n`;
menu += `📵 АНТИЗВОНКИ ${isSubbot ? (getSubbotConfig(botId).anticall ? '✅' : '❌') : '⚠️'}
• Bloquear llamadas
• ${usedPrefix + command} anticall`;
  
switch (type) {
case 'приветствие': case 'bienvenida':
if (!m.isGroup) throw '⚠️ Este comando solo se puede usar dentro de un grupo.'

await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET welcome = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'активность': case 'avisos':
if (!m.isGroup) throw '⚠️ Este comando solo se puede usar dentro de un grupo.'

await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET detect = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'антиссылка': case 'antienlace':
if (!m.isGroup) throw '⚠️ Este comando solo se puede usar dentro de un grupo.'

await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET antilink = $1 WHERE group_id = $2`, [isEnable, chatId])
break
      
case 'антиссылка2':
if (!m.isGroup) throw '⚠️ Este comando solo se puede usar dentro de un grupo.'

await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET antilink2 = $1 WHERE group_id = $2`, [isEnable, chatId])
break
            
case 'antiporn': case 'antiporno': case 'antinwfs':
if (!m.isGroup) throw '⚠️ Este comando solo se puede usar dentro de un grupo.'

await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET antiporn = $1 WHERE group_id = $2`, [isEnable, chatId])
break
            
case 'antiestado': case 'antiStatus':
if (!m.isGroup) throw '⚠️ Este comando solo se puede usar dentro de un grupo.'

await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET antiStatus = $1 WHERE group_id = $2`, [isEnable, chatId])
break
            
case 'antifake':
if (!m.isGroup) throw '⚠️ Este comando solo se puede usar dentro de un grupo.'

await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET antifake = $1 WHERE group_id = $2`, [isEnable, chatId])
break
      
case 'nsfw': case "modohorny": case "modocaliente":
if (!m.isGroup) throw '⚠️ Este comando solo se puede usar dentro de un grupo.'

  await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
  await db.query(`UPDATE group_settings SET modohorny = $1 WHERE group_id = $2`, [isEnable, chatId])
  break
      
case 'толькоадмин': case 'onlyadmin':
if (!m.isGroup) throw '⚠️ Este comando solo se puede usar dentro de un grupo.'

await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET modoadmin = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'интиличка': case 'antiprivado':
if (!isSubbot && !isOwner) return m.reply('❌ Solo el owner o subbots pueden cambiar esto.');
await db.query(`INSERT INTO subbots (id, anti_private)
    VALUES ($1, $2)
    ON CONFLICT (id) DO UPDATE SET anti_private = $2`, [cleanId, isEnable]);
isAll = true;
break;

case 'интизвонки': case 'antillamada':
if (!isSubbot && !isOwner) return m.reply('❌ Solo el owner o subbots pueden cambiar esto.');
await db.query(`INSERT INTO subbots (id, anti_call)
    VALUES ($1, $2)
    ON CONFLICT (id) DO UPDATE SET anti_call = $2`, [cleanId, isEnable]);
isAll = true;
break;
default:
return m.reply(menu.trim());
}
await m.reply(`🗂️ Эта опция *${type}* была ${isAll ? 'для' : isUser ? 'сейчас' : 'сейчас'} ✅ *${isEnable ? 'включена' : 'выключена'}* для этого чата.`)
}
handler.help = ['enable <opción>', 'disable <opción>']
handler.tags = ['nable']
handler.command = /^(включить|выключить)$/i
handler.register = true
//handler.group = true 
//handler.admin = true
export default handler
