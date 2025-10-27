import { MyContext } from "../../config/interfaces";

const privateKeyImport = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation
	
	ctx.session.waitingResponse = true;
	ctx.session.waitingAction = "ENTER_PRIVATE_KEY";

	// const promptMessage = await ctx.reply(`Enter Your Private Key:\n\n_Reply to this message_`, { parse_mode: "MarkdownV2" });
	const promptMessage = await ctx.reply(`Enter Your Private Key:`);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default privateKeyImport;