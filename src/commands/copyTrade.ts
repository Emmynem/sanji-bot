import { Markup } from "telegraf";
import { MyContext } from "../config/interfaces";
import { escapeMarkdownV2 } from "../config";
import accept from "../actions/accept";

const copyTrade = async (ctx: MyContext) => {

	if (!ctx.session.user?.accept) {
		accept(ctx);
	} else {
		if (ctx.session.user?.walletAddress) {
			try {
				await ctx.answerCbQuery(); // Remove loading animation
				
				return await ctx.editMessageText(
					"🤖 Sanji Bot allows you to copy trade any wallet address on SOL, BASE or ETH!\n\n"
					+ "💡 We blacklist wallet addresses that would drain your account. You need to provide good, human trader addresses! Copying snipers is NOT POSSIBLE because they use tech that costs tens of thousands of $!\n\n"
					+ "⚙️ Make sure to configure your copy trading settings before starting!\n\n"
					+ `📚 <a href="https://docs.sanjibot.io/advanced-setup/copy-trading">Full copy trading guide</a>\n\n`
					+ "🆕 Click “Add new copy address” below to begin.\n\n",
					// `${
					// 	ctx.session.user.copyTrades && ctx.session.user.copyTrades?.length > 0 ? 
					// 		`${ctx.session.user.copyTrades?.map((e, index) => {
					// 		return `${index + 1}. ${e.active ? "🟢 Trade copy active\n" : "🟠 Trade Copy paused\n" }` + 
					// 		`Tag: ${e.tag}\n` +
					// 		`Wallet: ${e.targetWallet}\n` + 
					// 		`Sell Copy: ${e.copySellStatus ? "✅ Yes" : "❌ No"} | Auto Sell: ${e.autoSellStatus ? "✅" : "❌"}\n` +
					// 		`Buy: ${e.buyAmount} SOL | Slippage: ${e.slippageAmount} SOL\n` +
					// 		`Buy Gas: ${e.buyGasAmount} SOL | Sell Gas: ${e.sellGasAmount} SOL` + 
					// 		"\n\n"
					// 	})}` :
					// 	""
					// }`
					
					// ctx.session.user.copyTrades && ctx.session.user.copyTrades?.length > 0 ? 
					// 	{
					// 		...Markup.inlineKeyboard([
					// 			[Markup.button.callback('Add new copy address 🆕', 'NEW_COPY_TRADE')],
					// 			// [Markup.button.callback(`${ctx.session.user.copyTrades && ctx.session.user.copyTrades?.length > 0 ? ctx.session.user.copyTrades.flatMap((e) => e.active).includes(true) ? "Pause All" : "Activate All" : "Pause All"}`, `${ctx.session.user.copyTrades && ctx.session.user.copyTrades?.length > 0 ? ctx.session.user.copyTrades.flatMap((e) => e.active).includes(true) ? "PAUSE_COPY_TRADES" : "ACTIVATE_COPY_TRADES" : "PAUSE_COPY_TRADES"}`)],
					// 			[Markup.button.callback('Adjust Settings 🛠️', 'DASHES')],
					// 			[Markup.button.callback('Back 🔙', 'REFRESH')],
					// 		]),
					// 		parse_mode: "MarkdownV2"
					// 	} :
						{
							...Markup.inlineKeyboard([
								[Markup.button.callback('Add new copy address 🆕', 'NEW_COPY_TRADE')],
								// [Markup.button.callback(`${ctx.session.user.copyTrades && ctx.session.user.copyTrades?.length > 0 ? ctx.session.user.copyTrades.flatMap((e) => e.active).includes(true) ? "Pause All" : "Activate All" : "Pause All"}`, `${ctx.session.user.copyTrades && ctx.session.user.copyTrades?.length > 0 ? ctx.session.user.copyTrades.flatMap((e) => e.active).includes(true) ? "PAUSE_COPY_TRADES" : "ACTIVATE_COPY_TRADES" : "PAUSE_COPY_TRADES"}`)],
								[Markup.button.callback('Adjust Settings 🛠️', 'DASHES')],
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

				return await ctx.reply(
					"🤖 Sanji Bot allows you to copy trade any wallet address on SOL, BASE or ETH!\n\n"
					+ "💡 We blacklist wallet addresses that would drain your account. You need to provide good, human trader addresses! Copying snipers is NOT POSSIBLE because they use tech that costs tens of thousands of $!\n\n"
					+ "⚙️ Make sure to configure your copy trading settings before starting!\n\n"
					+ `📚 <a href="https://docs.sanjibot.io/advanced-setup/copy-trading">Full copy trading guide</a>\n\n`
					+ "🆕 Click “Add new copy address” below to begin.\n\n",
					// `${
					// 	ctx.session.user.copyTrades && ctx.session.user.copyTrades?.length > 0 ? 
					// 		`${ctx.session.user.copyTrades?.map((e, index) => {
					// 		return `${index + 1}. ${e.active ? "🟢 Trade copy active\n" : "🟠 Trade Copy paused\n" }` + 
					// 		`Tag: ${e.tag}\n` +
					// 		`Wallet: ${e.targetWallet}\n` + 
					// 		`Sell Copy: ${e.copySellStatus ? "✅ Yes" : "❌ No"} | Auto Sell: ${e.autoSellStatus ? "✅" : "❌"}\n` +
					// 		`Buy: ${e.buyAmount} SOL | Slippage: ${e.slippageAmount} SOL\n` +
					// 		`Buy Gas: ${e.buyGasAmount} SOL | Sell Gas: ${e.sellGasAmount} SOL` + 
					// 		"\n\n"
					// 	})}` :
					// 	""
					// }`
					
					// ctx.session.user.copyTrades && ctx.session.user.copyTrades?.length > 0 ? 
					// 	{
					// 		...Markup.inlineKeyboard([
					// 			[Markup.button.callback('Add new copy address 🆕', 'NEW_COPY_TRADE')],
					// 			// [Markup.button.callback(`${ctx.session.user.copyTrades && ctx.session.user.copyTrades?.length > 0 ? ctx.session.user.copyTrades.flatMap((e) => e.active).includes(true) ? "Pause All" : "Activate All" : "Pause All"}`, `${ctx.session.user.copyTrades && ctx.session.user.copyTrades?.length > 0 ? ctx.session.user.copyTrades.flatMap((e) => e.active).includes(true) ? "PAUSE_COPY_TRADES" : "ACTIVATE_COPY_TRADES" : "PAUSE_COPY_TRADES"}`)],
					// 			[Markup.button.callback('Adjust Settings 🛠️', 'DASHES')],
					// 			[Markup.button.callback('Back 🔙', 'REFRESH')],
					// 		]),
					// 		parse_mode: "MarkdownV2"
					// 	} :
						{
							...Markup.inlineKeyboard([
								[Markup.button.callback('Add new copy address 🆕', 'NEW_COPY_TRADE')],
								// [Markup.button.callback(`${ctx.session.user.copyTrades && ctx.session.user.copyTrades?.length > 0 ? ctx.session.user.copyTrades.flatMap((e) => e.active).includes(true) ? "Pause All" : "Activate All" : "Pause All"}`, `${ctx.session.user.copyTrades && ctx.session.user.copyTrades?.length > 0 ? ctx.session.user.copyTrades.flatMap((e) => e.active).includes(true) ? "PAUSE_COPY_TRADES" : "ACTIVATE_COPY_TRADES" : "PAUSE_COPY_TRADES"}`)],
								[Markup.button.callback('Adjust Settings 🛠️', 'DASHES')],
								[Markup.button.callback('Back 🔙', 'REFRESH')],
							]),
							parse_mode: "HTML",
							link_preview_options: {
								is_disabled: true
							}
						}
				);
			}
		} else {
			return ctx.reply(
				"Create or Import a wallet\n",
				Markup.inlineKeyboard([
					[Markup.button.callback('Create Wallet', 'CREATE_WALLET')],
					[Markup.button.callback('Import Existing Wallet', 'IMPORT_WALLET')],
					[Markup.button.callback('Close', 'CLOSE')],
				])
			);
		}
	}
};

export default copyTrade;
