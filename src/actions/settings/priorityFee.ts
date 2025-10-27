import { Markup } from "telegraf";
import { MyContext } from "../../config/interfaces";
import { defaultTimer, escapeMarkdownV2 } from "../../config";
import settings from "../../commands/settings";

const priorityFee = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	try {
		await ctx.editMessageText(
			escapeMarkdownV2(
				"*Recommended* 🛠️: Bot chooses priority fee dynamically. Uses as low possible fee to save your money and as high as possible to make your transaction fast.\n\n" +		
				"*Fast* ⚡: Uses around 0.001 SOL per transaction\n\n" +		
				"*Ultra Fast* ⚡⚡: Uses around 0.005 SOL per transaction\n\n" +		
				"*Custom* ⚙️: You can set your own priority fee in SOL. This is how much you’re willing to pay for faster transaction."		
			),
			{
				...Markup.inlineKeyboard([
					[Markup.button.callback('✅ Recommended 🛠️', 'DASHES')],
					[Markup.button.callback('Fast ⚡', 'DASHES')],
					[Markup.button.callback('Ultra Fast ⚡⚡', 'DASHES')],
					[Markup.button.callback('Custom ⚙️', 'DASHES')],
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

export default priorityFee;