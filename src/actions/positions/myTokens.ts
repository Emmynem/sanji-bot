import { Markup } from "telegraf";
import { MyContext } from "../../config/interfaces";

const myTokens = async (ctx: MyContext) => {

	try {
		return await ctx.editMessageText(
			`🚫 No tokens found`,
			{
				...Markup.inlineKeyboard([
					[Markup.button.callback('Total Token Value ~ 0.00$', 'DASHES')],
					[Markup.button.callback('Buy 🎯', 'BUY'), Markup.button.callback('Sell & Manage 🛠️', 'SELL_MANAGE')],
					[Markup.button.callback('⬅️ Prev', 'DASHES'), Markup.button.callback('1', 'DASHES'), Markup.button.callback('Next ➡️', 'DASHES')],
					[Markup.button.callback('Refresh 🔃', 'DASHES')],
					[Markup.button.callback('Back 🔙', 'POSITIONS')],
				]),
				parse_mode: "MarkdownV2" 
			}
		);
	} catch (error) {
		// console.error("Error editing message:", error);
		// ctx.reply("⚠️ Unable to refresh. Try again.");
	}
};

export default myTokens;