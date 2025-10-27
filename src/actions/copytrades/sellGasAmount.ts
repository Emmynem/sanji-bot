import { MyContext } from "../../config/interfaces";

const sellGasAmount = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (ctx.session.user) {
		ctx.session.waitingResponse = true;
		ctx.session.waitingAction = "ENTER_COPY_TRADE_SELL_GAS_AMOUNT_VALUE";
	}

	ctx.session.currentCopyTradeMessageId = ctx.message?.message_id;

	const promptMessage = await ctx.reply(`Enter the priority fee to pay for sell trades. E.g 0.01 for 0.01 SOL`);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default sellGasAmount;