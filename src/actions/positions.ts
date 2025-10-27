import { Markup } from "telegraf";
import { MyContext } from "../config/interfaces";

const positions = async (ctx: MyContext) => {

	try {
		await ctx.answerCbQuery(); // Remove loading animation

		return await ctx.editMessageText(
			`Check your tokens, trade positions, history & trade configs 📈\n\n` +
			`💰 My Tokens: View total list of tokens you hold, click one to start selling.\n\n` +
			`📊 My Trades: Check profits, and other live stats about your trades.\n\n` +
			`🕛 Trade History: View & delete trade history.\n\n` +
			`⚙️ Trade Configs: Edit or place take profit & stop loss levels, you will need your txhash! This can be found right after you place a trade, or on the SolScan page for your wallet!`,
			{
				...Markup.inlineKeyboard([
					[Markup.button.callback('My Tokens 💰', 'MY_TOKENS'), Markup.button.callback('My Trades 📊', 'MY_TRADES_ALT')],
					[Markup.button.callback('Trade History 📊', 'TRADE_HISTORY')],
					[Markup.button.callback('Trade Configs ⚙️', 'TRADE_CONFIGS')],
					[Markup.button.callback('Back 🔙', 'REFRESH')],
				]),
				parse_mode: "HTML" 
			}
		);
	} catch (error) {
		// console.error("Error editing message:", error);
		// ctx.reply("⚠️ Unable to refresh. Try again.");
	}
};

export default positions;