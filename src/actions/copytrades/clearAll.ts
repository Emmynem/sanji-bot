import { MyContext } from "../../config/interfaces";
import copyTrade from "../../commands/copyTrade";
import { defaultTimer } from "../../config";

const clearAll = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (ctx.session.user?.copyTrades?.length === 0) {
		await ctx.reply(`No active copied trades`);
	} else {
		try {
			if (ctx.session.user && ctx.session.user.copyTrades) {
				ctx.session.user.copyTrades = [];
			}
			setTimeout(async () => {
				ctx.deleteMessage(ctx.message?.message_id).catch((err) => console.log('Error deleting user message:', err));
				copyTrade(ctx);
			}, defaultTimer);
		} catch (error) {
			// console.error("Error editing message:", error);
		}
	}
};

export default clearAll;