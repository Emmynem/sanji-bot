import { Markup } from "telegraf";
import { MyContext, MockSession } from "../config/interfaces";
import { escapeMarkdownV2, botSupportUsername } from "../config";
import { sessions } from "../../session.json";

const referral = async (ctx: MyContext) => {

	const currentSession: Array<MockSession> = sessions;
	// Ensure session is initialized

	try {
		return await ctx.editMessageText(
			`Referrals | Refer Users & Earn Commissions\n\n` + 
			`<b>Referred Users :</b> ${currentSession.filter((e) => e.data.user?.referredBy === ctx.chat?.id.toString()).length}\n` +
			`<b>Total SOL Earned :</b> 0\n\n` +
			`Share your referral link(s) and earn <b>30% SOL</b> of swap fees from users who click your link. Withdraw earnings using your Fee Receiver Wallet.\n\n` +
			`Note that, for solana you need to have at least 0.001 SOL in your wallet to receive fees.\n\n` +
			"Fee Receiver Wallet: " + `${ctx.session.user?.receiverWalletAddress ? `<code>${ctx.session.user?.receiverWalletAddress}</code>` : "N/A"}\n\n` +
			`Link:\n${ctx.session.user?.refLink} 🎁`,
			{
				...Markup.inlineKeyboard([
					[Markup.button.callback('Set Wallet For Commissions 🎁', 'SET_FEE_RECEIVER_WALLET')],
					[Markup.button.callback('Share your referral link ➡️', 'SHARE_REFERRAL_LINK')],
					[Markup.button.callback('Set Custom Referral Code ⚙️', 'SET_CUSTOM_REFERRAL_CODE')],
					[Markup.button.callback('Back 🔙', 'REFRESH')],
				]),
				parse_mode: "HTML" 
			}
		);
	} catch (error) {
		// console.error("Error editing message:", error);
		// ctx.reply("⚠️ Unable to refresh. Try again.");

		return await ctx.reply(
			`Referrals | Refer Users & Earn Commissions\n\n` + 
			`<b>Referred Users :</b> ${currentSession.filter((e) => e.data.user?.referredBy === ctx.chat?.id.toString()).length}\n` +
			`<b>Total SOL Earned :</b> 0\n\n` +
			`Share your referral link(s) and earn <b>30% SOL</b> of swap fees from users who click your link. Withdraw earnings using your Fee Receiver Wallet.\n\n` +
			`Note that, for solana you need to have at least 0.001 SOL in your wallet to receive fees.\n\n` +
			"Fee Receiver Wallet: " + `${ctx.session.user?.receiverWalletAddress ? `<code>${ctx.session.user?.receiverWalletAddress}</code>` : "N/A"}\n\n` +
			`Link:\n${ctx.session.user?.refLink} 🎁`,
			{
				...Markup.inlineKeyboard([
					[Markup.button.callback('Set Wallet For Commissions 🎁', 'SET_FEE_RECEIVER_WALLET')],
					[Markup.button.callback('Share your referral link ➡️', 'SHARE_REFERRAL_LINK')],
					[Markup.button.callback('Set Custom Referral Code ⚙️', 'SET_CUSTOM_REFERRAL_CODE')],
					[Markup.button.callback('Back 🔙', 'REFRESH')],
				]),
				parse_mode: "HTML" 
			}
		);
	}
};

export default referral;