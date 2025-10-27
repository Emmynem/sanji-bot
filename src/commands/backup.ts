import { MyContext } from "../config/interfaces";

const backup = async (ctx: MyContext) => {

	await ctx.reply(
		`Bot not working, or lagging?\n\n` +
		`Try one of our backup bots:\n\n` +
		`Official Backup 1: @SanjiBackupbot\n\n` +
		`Support Group: <a href="https://discord.gg/sanjihq">Click To Join</a>\n\n` +
		`Remember: Use official links only, check the spelling carefully! We will never DM you, we will never call you!`
	);
};

export default backup;