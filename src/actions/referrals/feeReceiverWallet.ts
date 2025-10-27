import { MyContext } from "../../config/interfaces";

const feeReceiverWallet = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation
	
	ctx.session.waitingResponse = true;
	ctx.session.waitingAction = "ENTER_FEE_RECEIVER_WALLET";

	const promptMessage = await ctx.reply(`✏️ Set a Fee Receiver Wallet. This wallet will receive fees from referrals!`);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default feeReceiverWallet;