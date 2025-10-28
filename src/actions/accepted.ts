import { MyContext } from "../config/interfaces";
import start from "../commands/start";
import { botLink, newUserDetails } from "../config";

const accepted = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation
	
	const startPayload = ctx.startPayload;

	ctx.session = {
		chatId: ctx.chat?.id, // Store user's chat ID
		fromId: ctx.from?.id,   // Store user's from ID
		username: ctx.from?.username,   // Store user's from Username
		name: ctx.from?.first_name,
		user: { ...newUserDetails, accept: true, id: ctx.chat?.id, refLink: botLink + ctx.chat?.id, referredBy: startPayload ? startPayload : null, settings: { ...newUserDetails.settings, mevProtectValue: "Turbo", transactionPriorityValue: "Medium" } }
	}
	
	// if (ctx.session.user) ctx.session.user.accept = true;

	start(ctx);
};

export default accepted;