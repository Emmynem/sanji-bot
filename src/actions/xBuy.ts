import { Markup } from "telegraf";
import bot from "../bot";
import { MyContext } from "../config/interfaces";
import { escapeMarkdownV2 } from "../config";

const xBuy = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	ctx.session.waitingAction = "BUY_TOKEN_X_VALUE_AMOUNT";

	if ((ctx.session.user?.balance || 0) > 0) {
		const promptMessage = await ctx.reply(`Reply with the amount you want to buy \\(0 \\- ${escapeMarkdownV2((ctx.session.user?.balance || 0).toString())}, Example: 0\\.1\\)`, { parse_mode: "MarkdownV2" });
	
		ctx.session.promptMessageId = promptMessage.message_id;
	} else {
		await ctx.reply('Insufficient Balance\\.\n\n_Not enough SOL to buy ticker_', {
			...Markup.inlineKeyboard([
				[Markup.button.url('Buy', 'https://buy.moonpay.com/v2/buy?currencyCode=sol'), Markup.button.callback('Deposit', 'DEPOSIT')],
				[Markup.button.callback('Close', 'CLOSE')],
			]),
			parse_mode: "MarkdownV2"
		});

		// Optional: Clear session after capturing response
		delete ctx.session.waitingAction;
		delete ctx.session.promptMessageId;
	}
};

export default xBuy;