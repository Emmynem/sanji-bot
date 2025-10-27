import { MyContext } from "../../config/interfaces";

const buyAmount = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (ctx.session.user) {
		ctx.session.waitingResponse = true;
		ctx.session.waitingAction = "ENTER_COPY_TRADE_BUY_AMOUNT_VALUE";
	}

	ctx.session.currentCopyTradeMessageId = ctx.message?.message_id;

	const promptMessage = await ctx.reply(`To buy with a fixed sol amount, enter a number. E.g. 0.1 SOL will buy with 0.1 SOL regardless of the target's buy amount.`);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default buyAmount;