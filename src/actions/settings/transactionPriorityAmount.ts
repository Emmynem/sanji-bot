import { MyContext } from "../../config/interfaces";

const transactionPriorityAmount = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (ctx.session.user) {
		ctx.session.user.settings.waitingForSettingsResponse = true;
		ctx.session.waitingAction = "ENTER_TRANSACTION_PRIORITY_AMOUNT";
	}

	ctx.session.currentSettingsMessageId = ctx.message?.message_id;

	const promptMessage = await ctx.reply(`💬 Reply with the new transaction priority amount`);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default transactionPriorityAmount;