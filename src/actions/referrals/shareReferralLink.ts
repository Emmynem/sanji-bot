import { Markup } from "telegraf";
import { MyContext } from "../../config/interfaces";

const shareReferralLink = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation
	
	await ctx.reply(
		`Sanji is the best Telegram Trading Bot for Solana.\n\n` +
		`Copy any wallet automatically while you sleep, and trade faster & easier.\n\n` + 
		`${ctx.session.user?.refLink}`, 
		{
			...Markup.inlineKeyboard([
				[Markup.button.url('Share 📤', `${ctx.session.user?.refLink}`)],
			]),
			parse_mode: "HTML"
		}
	);
};

export default shareReferralLink;