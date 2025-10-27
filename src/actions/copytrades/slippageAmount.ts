import { MyContext } from "../../config/interfaces";

const slippageAmount = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (ctx.session.user) {
		ctx.session.waitingResponse = true;
		ctx.session.waitingAction = "ENTER_COPY_TRADE_SLIPPAGE_AMOUNT_VALUE";
	}

	ctx.session.currentCopyTradeMessageId = ctx.message?.message_id;

	const promptMessage = await ctx.reply(`Enter slippage % to use on copy trades`);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default slippageAmount;