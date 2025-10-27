import { MyContext } from "../../config/interfaces";
import { defaultTimer } from "../../config";
import newCopyTrade from "../../actions/copytrades/newCopyTrade";

const copySell = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (ctx.session.user) {
		if (ctx.session.user.currentCopyTrade) {
			ctx.session.user.currentCopyTrade.copySellStatus = ctx.session.user.currentCopyTrade.copySellStatus ? false : true;
		}
	}

	try {
		setTimeout(async () => {
			ctx.deleteMessage(ctx.message?.message_id).catch((err) => console.log('Error deleting user message:', err));
			newCopyTrade(ctx);
		}, defaultTimer);
	} catch (error) {
		// console.error("Error editing message:", error);
	}
};

export default copySell;