import { Markup } from "telegraf";
import { MyContext } from "../config/interfaces";

const limitOrders = async (ctx: MyContext) => {

	try {
		return await ctx.editMessageText(
			`Manage all limit orders:\n` +
			`You have no current limit orders set.\n\n` +
			
			`Create one from the Sell & Manage menu!\n\n` +
			
			`📚 <a href="https://docs.sanjibot.io/advanced-setup/limit-orders">Full Guide On Limit Orders</a>\n\n` +
			
			`Paste a token contract address to set a limit order ⤵️`,
			{
				...Markup.inlineKeyboard([
					[Markup.button.callback('⬅️ Prev', 'DASHES'), Markup.button.callback('1', 'DASHES'), Markup.button.callback('Next ➡️', 'DASHES')],
					[Markup.button.callback('Back 🔙', 'REFRESH')],
				]),
				parse_mode: "HTML",
				link_preview_options: {
					is_disabled: true
				}
			}
		);
	} catch (error) {
		// console.error("Error editing message:", error);
		// ctx.reply("⚠️ Unable to refresh. Try again.");
	}
};

export default limitOrders;