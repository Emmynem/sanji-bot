import { MyContext } from "../../config/interfaces";

const customReferralCode = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation
	
	ctx.session.waitingResponse = true;
	ctx.session.waitingAction = "ENTER_CUSTOM_REFERRAL_CODE";

	const promptMessage = await ctx.reply(
		`Send your custom referral code below. It will be shown on your links. Maximum 20 characters. Numbers and letters only.\n\n` +
		`Note that, if you change it, default referral links will continue to work but previous custom referral links will be disabled. Users who have used your previous custom referral links will not be affected.`
	);

	ctx.session.promptMessageId = promptMessage.message_id;
};

export default customReferralCode;