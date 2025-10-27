import { Markup } from "telegraf";
import { MyContext } from "../../config/interfaces";
import { defaultTimer, escapeMarkdownV2 } from "../../config";
import settings from "../../commands/settings";

const copyTradeSettings = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	try {
		await ctx.editMessageText(
			escapeMarkdownV2(
				"Change Copy Trade Settings ⬇️"			
			),
			{
				...Markup.inlineKeyboard([
					[Markup.button.callback('Edit buy amount - 0.05 SOL 📝', 'DASHES')],
					[Markup.button.callback('Consecutive Buy - 3 📝', 'DASHES')],
					[Markup.button.callback('Selet Your Sell Type ⬇️', 'DASHES')],
					[Markup.button.callback('ALL 🔴', 'DASHES'), Markup.button.callback('PERCENTAGE 🟢', 'DASHES')],
					[Markup.button.callback('PumpFun Enabled ✅', 'DASHES')],
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

export default copyTradeSettings;