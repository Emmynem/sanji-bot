import { MyContext } from "../config/interfaces";

const burn = async (ctx: MyContext) => {

	await ctx.reply(`Started processing token account close. You will be notified when its completed.`);
	await ctx.reply(`Closed 0 token accounts. You will claim 0.002 SOL for each with total around 0.000 SOL.`);
};

export default burn;