import { Markup } from "telegraf";
import { MyContext } from "../config/interfaces";

const myTrades = async (ctx: MyContext) => {

	try {
		return await ctx.editMessageText(
			`🚫 No trades found`,
			{
				...Markup.inlineKeyboard([
					[Markup.button.callback('⬅️ Prev', 'DASHES'), Markup.button.callback('1', 'DASHES'), Markup.button.callback('Next ➡️', 'DASHES')],
					[Markup.button.callback('Refresh 🔃', 'DASHES')],
					[Markup.button.callback('Back 🔙', 'REFRESH')],
				]),
				parse_mode: "MarkdownV2" 
			}
		);
	} catch (error) {
		// console.error("Error editing message:", error);
		// ctx.reply("⚠️ Unable to refresh. Try again.");
	}
};

export default myTrades;