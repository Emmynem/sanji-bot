import { MyContext } from "../config/interfaces";

const alpha = async (ctx: MyContext) => {

	await ctx.reply(
		`Need help finding coins + more alpha?\n\n` +
		`(Free) Gold Squad Discord: https://discord.gg/gold-squad\n\n` +
		`(Free) Degen Warzone Alpha Calls Main Group: https://t.me/degenwar` 
	);
};

export default alpha;