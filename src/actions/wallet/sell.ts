import { MyContext } from "../../config/interfaces";
import accept from "../accept";

const sell = async (ctx: MyContext) => {
	if (!ctx.session.user?.accept) {
		accept(ctx);
	} else {
		try {
			await ctx.answerCbQuery(); // Remove loading animation
	
			await ctx.reply(`No active positions`);
		} catch (error) {
			await ctx.reply(`No active positions`);
		}
	}
};

export default sell;