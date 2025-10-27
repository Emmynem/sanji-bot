import { Markup } from "telegraf";
import { MyContext } from "../config/interfaces";
import { escapeMarkdownV2 } from "../config";

const accept = async (ctx: MyContext) => {

	ctx.reply( 
		`By clicking continue and using Sanji Bot, you agree and are bound by these <a href="https://docs.sanjibot.io/legal-documents/terms-of-use">terms of service / use</a>\n\n` +
		`You are responsible for keeping your private key safe and not clicking links.\n\n` +
		`You are responsible for all of your financial decisions, losses or gains.\n\n` + 
		`You understand that crypto is EXTREMELY high risk.`,
		{
			...Markup.inlineKeyboard([
				[Markup.button.callback('📜 Accept', 'ACCEPT')]
			]), 
			parse_mode: "HTML",
			link_preview_options: {
				is_disabled: true
			}
		}
	);
};

export default accept;