import { MyContext } from "../config/interfaces";
import start from "../commands/start";

const accepted = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation
	
	if (ctx.session.user) ctx.session.user.accept = true;

	start(ctx);
};

export default accepted;