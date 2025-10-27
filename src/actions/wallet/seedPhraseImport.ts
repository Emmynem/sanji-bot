import { MyContext } from "../../config/interfaces";

const seedPhraseImport = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation
	
	ctx.session.waitingResponse = true;
	ctx.session.waitingAction = "ENTER_SEED_PHRASE";

	// const promptMessage = await ctx.reply(`Enter Your Seed Phrase:\n\n_Reply to this message_`, { parse_mode: "MarkdownV2" });
	const promptMessage = await ctx.reply(`Enter Your Seed Phrase:`);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default seedPhraseImport;