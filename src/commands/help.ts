import { MyContext } from "../config/interfaces";
import { escapeMarkdownV2, botSupportUsername } from "../config";

const help = async (ctx: MyContext) => {

	return ctx.reply(
		`If you need help please read through our comprehensive support/help documents first: <a href="https://docs.sanjibot.io/">Click Here</a>\n\n`
		+ `If you still need help join our support group and get support: <a href="https://discord.gg/sanjihq">Click Here</a>`, 
		{ 
			parse_mode: "HTML" 
		}
	);
};

export default help;
