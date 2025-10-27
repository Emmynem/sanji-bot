import { MyContext } from "../../config/interfaces";
import { defaultTimer } from "../../config";
import settings from "../../commands/settings";

const autoBuy = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (ctx.session.user) {
		if (ctx.session.user.settings) {
			ctx.session.user.settings.autoBuyStatus = ctx.session.user.settings.autoBuyStatus ? false : true;
		}
	}

	try {
		setTimeout(async () => {
			ctx.deleteMessage(ctx.message?.message_id).catch((err) => console.log('Error deleting user message:', err));
			settings(ctx);
		}, defaultTimer);
	} catch (error) {
		// console.error("Error editing message:", error);
		// ctx.reply("⚠️ Unable to refresh balance. Try again.");
	}
};

export default autoBuy;