import { MyContext } from "../../config/interfaces";
import { escapeMarkdownV2 } from "../../config";

const withdraw = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	// if (ctx.session.user?.balance && (ctx.session.user?.balance < 0.0001 || ctx.session.user?.balance === 0)) {
	if (ctx.session.user?.balance == 0) {
		await ctx.reply(`Insufficient funds, To deposit send SOL to below address:`);
		await ctx.reply(`\`${ctx.session.user?.walletAddress}\` \\(tap to copy\\)\n\n`, { parse_mode: "MarkdownV2" })
		return;
	} else {
		ctx.session.waitingResponse = true;
		ctx.session.waitingAction = "ENTER_WITHDRAWAL_AMOUNT";
	
		const promptMessage = await ctx.reply(`Reply with the amount to withdraw \\(0 \\- ${escapeMarkdownV2((ctx.session.user?.balance || 0).toString())}, Example: 0\\.1\\)`, { parse_mode: "MarkdownV2" });
		
		ctx.session.promptMessageId = promptMessage.message_id;
		return;
	}
};

export default withdraw;