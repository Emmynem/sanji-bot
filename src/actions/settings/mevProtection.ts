import { Markup } from "telegraf";
import { MyContext } from "../../config/interfaces";
import { defaultTimer, escapeMarkdownV2 } from "../../config";
import settings from "../../commands/settings";

const mevProtection = async (ctx: MyContext) => {
	
	if (ctx.session.user) {
		if (ctx.session.user.settings) {
			ctx.session.user.settings.mevProtection = ctx.session.user.settings.mevProtection ? false : true;
		}
	}
	
	try {
		await ctx.answerCbQuery(); // Remove loading animation
		
		await ctx.editMessageText(
			"⚙️ Customize your settings!\n\n"
			+ "🔃 Universal Trade Settings: Apply to ALL trades across your entire bot, INCLUDING copy trading!\n\n"
			+ "🔃 Copy Trade Settings: Apply to copy trading only!\n\n"
			+ "🔃 Preset Settings: Define your own presets for quick trading!\n\n"
			+ "✅ MEV Protected: Click to turn ON or OFF. Click to get an explanation of what this does!\n\n"
			+ "⏩️ Priority Fee: Customize your fees for faster transactions.\n\n"
			+ "✅ Buy Confirmation: Click to turn ON or OFF for asking confirmation before for each buy.\n\n"
			+ "🔒 Security: Set your security(2FA) setting\n\n"
			+ "🌐 Language: Change language of your bot.\n\n"
			+ `📚 <a href="https://docs.sanjibot.io/beginner-setup/universal-settings">Full Settings Guide</a>`,
			{
				...Markup.inlineKeyboard([
					[Markup.button.callback('Universal Trade Settings 🔃', 'UNIVERSAL_TRADE_SETTINGS')],
					[Markup.button.callback('Copy Trade Settings 🔃', 'COPY_TRADE_SETTINGS')],
					[Markup.button.callback('Preset Settings ⚙️', 'PRESET_SETTINGS')],
					[Markup.button.callback(`MEV Protection ${ctx.session.user?.settings.mevProtection ? "✅" : "❌"}`, 'SETTINGS_UPDATE_MEV_PROTECTION')],
					[Markup.button.callback('Priority Fee ⏩', 'PRIORITY_FEE')],
					[Markup.button.callback(`Buy Confirmation ${ctx.session.user?.settings.buyConfirmation ? "✅" : "❌"}`, 'SETTINGS_UPDATE_BUY_CONFIRMATION')],
					[Markup.button.callback('Security 🔒', 'DASHES')],
					[Markup.button.callback(`Language 🌐 - ${ctx.session.user?.settings.language}`, 'SETTINGS_UPDATE_LANAGUAGE')],
					[Markup.button.callback(`Paper Trading Mode ${ctx.session.user?.settings.paperTradingMode ? "🟢" : "🔴"}`, 'SETTINGS_UPDATE_PAPER_TRADING_MODE')],
					[Markup.button.callback('Back 🔙', 'REFRESH')],					
				]),
				parse_mode: "HTML"
			}
		);

		if (ctx.session.user) {
			if (ctx.session.user.settings) {
				ctx.session.user.settings.mevProtection ? 
					await ctx.reply(
						`MEV Protection is now ENABLED ✅\n\n` +
						`You will pay a small tip of 0.001 $SOL ($0.25) per transaction, to be protected from MEV bots.\n\n` +
						`💡 Sanji makes $0 on this tip. You are NOT tipping us, you're using Jito.\n\n` +
						`📚 <a href="https://docs.sanjibot.io/beginner-setup/universal-settings/mev-protection">Full Guide</a>`,
						{
							parse_mode: "HTML",
							link_preview_options: {
								is_disabled: true
							}
						}
					) : 
					await ctx.reply(
						`MEV Protection is now DISABLED for all of your transactions`
					) 
			}
		}
	} catch (error) {
		// console.error("Error editing message:", error);
		// ctx.reply("⚠️ Unable to refresh. Try again.");
	}
};

export default mevProtection;