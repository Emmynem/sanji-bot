import { MyContext } from "../../config/interfaces";
import { defaultTimer, newUserDetails } from "../../config";
import copyTrade from "../../commands/copyTrade";

const addCopyTrade = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (!ctx.session.user?.currentCopyTrade?.tag) {
		const promptMessage = await ctx.reply(`Please, Enter a custom name for this copy trade setup:`);

		ctx.session.promptMessageId = promptMessage.message_id;
		ctx.session.waitingResponse = true;
		ctx.session.waitingAction = "ENTER_COPY_TRADE_TAG_VALUE";

		return;
	} else if (!ctx.session.user?.currentCopyTrade?.targetWallet) {
		const promptMessage = await ctx.reply(`Please, Enter the target wallet address to copy trade`);
		
		ctx.session.promptMessageId = promptMessage.message_id;
		ctx.session.waitingResponse = true;
		ctx.session.waitingAction = "ENTER_COPY_TRADE_TARGET_WALLET_VALUE";
		
		return;
	} else {
		if (ctx.session.user) {
			if (ctx.session.user.copyTrades && ctx.session.user.currentCopyTrade) {
				ctx.session.user.copyTrades?.push(ctx.session.user.currentCopyTrade);
				ctx.session.user.currentCopyTrade = newUserDetails.currentCopyTrade;
			}
		}
	
		try {
			setTimeout(async () => {
				ctx.deleteMessage(ctx.message?.message_id).catch((err) => console.log('Error deleting user message:', err));
				copyTrade(ctx);
			}, defaultTimer);
		} catch (error) {
			// console.error("Error editing message:", error);
		}
	}
};

export default addCopyTrade;