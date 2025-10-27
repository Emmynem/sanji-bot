import { MyContext } from "../../config/interfaces";

const targetWallet = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	if (ctx.session.user) {
		ctx.session.waitingResponse = true;
		ctx.session.waitingAction = "ENTER_COPY_TRADE_TARGET_WALLET_VALUE";
	}

	ctx.session.currentCopyTradeMessageId = ctx.message?.message_id;

	const promptMessage = await ctx.reply(`Enter the target wallet address to copy trade`);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default targetWallet;