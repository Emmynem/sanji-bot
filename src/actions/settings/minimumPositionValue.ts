import { MyContext } from "../../config/interfaces";

const minimumPositionValue = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (ctx.session.user) {
		ctx.session.user.settings.waitingForSettingsResponse = true;
		ctx.session.waitingAction = "ENTER_MINIMUM_POSITION_VALUE";
	}

	ctx.session.currentSettingsMessageId = ctx.message?.message_id;

	const promptMessage = await ctx.reply(`💬 Reply with the new minimum position value`);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default minimumPositionValue;