import { Markup } from "telegraf";
import { MyContext } from "../../config/interfaces";
import { defaultTimer, escapeMarkdownV2 } from "../../config";
import settings from "../../commands/settings";

const universalTradeSettings = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	try {
		await ctx.editMessageText(
			"⚙️ Changing these settings will affect ALL TRADES including copy trades, and regular trades.\n\n"
			+ "💡 If you want to set INDIVIDUAL take profit and stop loss levels, please do that using the button on your BUY CONFIRMATION message.\n"
			+ "You can also configure individual trade configurations by going to the “Positions” button and clicking “Trade Configs” and entering the Transaction Hash.\n\n"
			+ "🛑 Stop loss: Sells at a loss to prevent potential bigger losses\n\n"
			+ "💰 Take profit: Sells tokens at your profit level\n\n"
			+ "💵 TP sell percentage: What % of your total tokens do you want to sell\n\n"
			+ "💦 Slippage: Slippage = you pay more or get less than expected in a trade because the price changed too fast. High slippage = higher chance to get trade through, but potential worse entry. Set slippage based on type of coins you are buying. Lower liquidity needs higher slippage.\n\n"
			+ `📚 Need more help? <a href="https://docs.sanjibot.io/beginner-setup/settings">Click Here!</a>`,  
			{
				...Markup.inlineKeyboard([
					[Markup.button.callback('🔴 Edit stop loss - 0% 📝', 'DASHES')],
					[Markup.button.callback('🔴 Edit take profit - 0% 📝', 'DASHES')],
					[Markup.button.callback('Edit TP sell percentage - 100% 📝', 'DASHES')],
					[Markup.button.callback('Edit buy slippage - 15% 📝', 'DASHES')],
					[Markup.button.callback('Edit sell slippage - 15% 📝', 'DASHES')],
					[Markup.button.callback('Back 🔙', 'SETTINGS')],					
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

export default universalTradeSettings;