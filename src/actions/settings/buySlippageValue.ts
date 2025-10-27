import { MyContext } from "../../config/interfaces";

const buySlippageValue = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (ctx.session.user) {
		ctx.session.user.settings.waitingForSettingsResponse = true;
		ctx.session.waitingAction = "ENTER_BUY_SLIPPAGE_VALUE";
	}

	ctx.session.currentSettingsMessageId = ctx.message?.message_id;

	const promptMessage = await ctx.reply(`💬 Reply with the new buy slippage value`);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default buySlippageValue;