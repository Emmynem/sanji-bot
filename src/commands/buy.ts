import { MyContext } from "../config/interfaces";

const buy = async (ctx: MyContext) => {

	await ctx.reply(`Provide token address to buy ⬇️`);
	ctx.session.waitingAction = "BUY_TICKER";
};

export default buy;