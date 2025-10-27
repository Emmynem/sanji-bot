import { Markup } from "telegraf";
import { MyContext } from "../../config/interfaces";
import { defaultTimer, escapeMarkdownV2 } from "../../config";
import settings from "../../commands/settings";

const presetSettings = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	try {
		await ctx.editMessageText(
			escapeMarkdownV2(
				"Customize your preset buy and sell values!\n\n" +		
				"These are the preset amounts that pop up when you paste a CA into the bot.\n\n" +		
				"Click a value below to set a new value."		
			),
			{
				...Markup.inlineKeyboard([
					[Markup.button.callback('⬇️ Change Preset Buy Values ⬇️', 'DASHES')],
					[Markup.button.callback('Buy 1 SOL', 'DASHES'), Markup.button.callback('Buy 5 SOL', 'DASHES'), Markup.button.callback('Buy 10 SOL', 'DASHES')],
					[Markup.button.callback('⬇️ Change Preset Sell Values (%) ⬇️', 'DASHES')],
					[Markup.button.callback('Sell 25%', 'DASHES'), Markup.button.callback('Sell 50%', 'DASHES'), Markup.button.callback('Sell 100%', 'DASHES')],
					[Markup.button.callback('Back 🔙', 'SETTINGS')],					
				]),
				parse_mode: "MarkdownV2"
			}
		);
	} catch (error) {
		// console.error("Error editing message:", error);
		// ctx.reply("⚠️ Unable to refresh. Try again.");
	}
};

export default presetSettings;