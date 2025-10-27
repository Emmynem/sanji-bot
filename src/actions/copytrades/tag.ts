import { MyContext } from "../../config/interfaces";

const tag = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (ctx.session.user) {
		ctx.session.waitingResponse = true;
		ctx.session.waitingAction = "ENTER_COPY_TRADE_TAG_VALUE";
	}

	ctx.session.currentCopyTradeMessageId = ctx.message?.message_id;

	const promptMessage = await ctx.reply(`Enter a custom name for this copy trade setup`);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default tag;