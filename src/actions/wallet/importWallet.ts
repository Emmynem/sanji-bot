import { Markup } from "telegraf";
import { MyContext } from "../../config/interfaces";

const importWallet = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation
	
	ctx.reply(
		`Choose mode to import wallet`,
		Markup.inlineKeyboard([
			[Markup.button.callback('Seed Phrase', 'SEED_PHRASE_IMPORT'), Markup.button.callback('Private Key', 'PRIVATE_KEY_IMPORT')],
			[Markup.button.callback('Close', 'CLOSE')],
		])
	);
};

export default importWallet;