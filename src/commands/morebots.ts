import { MyContext } from "../config/interfaces";

const morebots = async (ctx: MyContext) => {

	await ctx.reply(
		`Sanji Bot is MULTI-CHAIN!\n\n` +
		
		`Trade on 7 different blockchains!\n\n` +
		
		`XRP: @XRPSanjiBot\n` +
		`SUI: @SUISanjiBot\n` +
		`BASE / ETH / BSC: @EVMSanjiBot\n` +
		`HBAR: @HBARSanjiBot\n\n` +
		
		`*Use ONLY official bot links! We will never DM you! We will never contact you!*`
	);
};

export default morebots;