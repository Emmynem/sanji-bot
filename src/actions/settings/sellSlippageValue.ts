import { MyContext } from "../../config/interfaces";

const sellSlippageValue = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (ctx.session.user) {
		ctx.session.user.settings.waitingForSettingsResponse = true;
		ctx.session.waitingAction = "ENTER_SELL_SLIPPAGE_VALUE";
	}

	ctx.session.currentSettingsMessageId = ctx.message?.message_id;

	const promptMessage = await ctx.reply(`💬 Reply with the new sell slippage value`);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default sellSlippageValue;