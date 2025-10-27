import { Markup } from "telegraf";
import { MyContext } from "../config/interfaces";
import { defaultTimer, solscanNetworkAddress } from "../config";

const leftBuy = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	ctx.session.waitingAction = "BUY_TOKEN_LEFT_VALUE_AMOUNT";

	const buyAmount = ctx.session.user?.settings.leftBuyValue;

	if (ctx.session.user && buyAmount && (ctx.session.user.balance !== undefined && (ctx.session.user.balance === 0 || ctx.session.user.balance < buyAmount || ctx.session.user.balance - buyAmount < 0))) {
		await ctx.reply('Insufficient Balance\\.\n\n_Not enough SOL to buy ticker_', { 
			...Markup.inlineKeyboard([
				[Markup.button.url('Buy', 'https://buy.moonpay.com/v2/buy?currencyCode=sol'), Markup.button.callback('Deposit', 'DEPOSIT')],
				[Markup.button.callback('Close', 'CLOSE')],
			]),
			parse_mode: "MarkdownV2" 
		});
		setTimeout(() => {
			delete ctx.session.waitingAction;
		}, defaultTimer);
	} else {
		if (ctx.session.user && ctx.session.user.balance !== undefined && buyAmount !== undefined) {
			ctx.session.user.balance = parseFloat((ctx.session.user.balance - buyAmount).toPrecision(7));
		}

		await ctx.reply(`Transaction initiated\\.\n\n_View transaction on Explorer_`, {
			...Markup.inlineKeyboard([
				[Markup.button.url('View on Solscan', `${solscanNetworkAddress}${ctx.session.waitingTicker}`), Markup.button.callback('Wallet', 'WALLET')],
				[Markup.button.callback('Close', 'CLOSE')],
			]),
			parse_mode: "MarkdownV2"
		});
	}

	// Optional: Clear session after capturing response
	delete ctx.session.waitingAction;
};

export default leftBuy;