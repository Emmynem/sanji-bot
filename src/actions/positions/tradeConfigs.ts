import { Markup } from "telegraf";
import { MyContext } from "../../config/interfaces";

const tradeConfigs = async (ctx: MyContext) => {

	try {
		return await ctx.editMessageText(
			`No trade configs found! 🚫\n\n` +
			`Use limit orders instead`,
			{
				...Markup.inlineKeyboard([
					[Markup.button.callback('⬅️ Prev', 'DASHES'), Markup.button.callback('1', 'DASHES'), Markup.button.callback('Next ➡️', 'DASHES')],
					[Markup.button.callback('Back 🔙', 'POSITIONS')],
				]),
				parse_mode: "HTML" 
			}
		);
	} catch (error) {
		// console.error("Error editing message:", error);
		// ctx.reply("⚠️ Unable to refresh. Try again.");
	}
};

export default tradeConfigs;