import { Markup } from "telegraf";
import { MyContext } from "../../config/interfaces";
import { escapeMarkdownV2 } from "../../config";

const newCopyTrade = async (ctx: MyContext) => {

	if (ctx.session.user?.walletAddress) {
		return ctx.reply(
			escapeMarkdownV2(
				"*To setup a new Copy Trade:*\n\n"
				+ "- Assign a unique name or “tag” to your target wallet, to make it easier to identify.\n"
				+ "- Enter the target wallet address to copy trade.\n"
				+ "- Enter the percentage of the target's buy amount to copy trade with, or enter a specific SOL amount to always use.\n"
				+ "- Toggle on Copy Sells to copy the sells of the target wallet.\n"
				+ "- Click “Add” to create and activate the Copy Trade.\n\n"
				+ `*To manage your Copy Trade:*\n`
				+ "- Click the “Active” button to “Pause” the Copy Trade.\n"
				+ "- Delete a Copy Trade by clicking the “Delete” button.\n"
			),
			{
				...Markup.inlineKeyboard([
					[Markup.button.callback(`Tag: ${ctx.session.user.currentCopyTrade?.tag ? ctx.session.user.currentCopyTrade?.tag : "--" }`, 'NEW_COPY_TRADE_TAG')],
					[Markup.button.callback(`Target Wallet: ${ctx.session.user.currentCopyTrade?.targetWallet ? ctx.session.user.currentCopyTrade?.targetWallet : "--" }`, 'NEW_COPY_TRADE_TARGET_WALLET')],
					[Markup.button.callback(`Buy SOL: ${ctx.session.user.currentCopyTrade?.buyAmount}`, 'NEW_COPY_TRADE_BUY_AMOUNT'), Markup.button.callback(`Copy Sells: ${ctx.session.user.currentCopyTrade?.copySellStatus ? "✅ Yes" : "❌ No"}`, 'NEW_COPY_TRADE_COPY_SELL')],
					[Markup.button.callback(`Buy Gas: ${ctx.session.user.currentCopyTrade?.buyGasAmount} SOL`, 'NEW_COPY_TRADE_BUY_GAS_AMOUNT'), Markup.button.callback(`Sell Gas: ${ctx.session.user.currentCopyTrade?.sellGasAmount} SOL`, 'NEW_COPY_TRADE_SELL_GAS_AMOUNT')],
					[Markup.button.callback(`Slippage: ${ctx.session.user.currentCopyTrade?.slippageAmount}%`, 'NEW_COPY_TRADE_SLIPPAGE_AMOUNT')],
					[Markup.button.callback(`Auto Sell: ${ctx.session.user.currentCopyTrade?.autoSellStatus ? "✅" : "❌"}`, 'NEW_COPY_TRADE_AUTO_SELL')],
					[Markup.button.callback('Add', 'NEW_COPY_TRADE_ADD')],
					[Markup.button.callback('Back', 'copytrade')],
				]),
				parse_mode: "MarkdownV2"
			}
		);
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
};

export default newCopyTrade;
