import { Context } from 'telegraf';

export interface User {
	id?: number;
	accept?: boolean;
	solanaPrice?: number;
	walletBalance?: number;
	balance?: number;
	walletAddress?: string;
	receiverWalletAddress?: string;
	publicKey?: string;
	secretKey?: string;
	privateKey?: string;
	seed?: string;
	refLink?: string;
	referrals?: number;
	referredBy?: string | null;
	settings: Settings;
	positions?: Array<IPositions>;
	copyTrades?: Array<ICopyTrades>;
	currentCopyTrade: ICopyTrades;
}

interface Settings {
	waitingForSettingsResponse?: boolean;
	language?: string;
	minimumPositionValue?: number;
	autoBuyStatus?: boolean;
	autoBuyValue?: number;
	instantRugExitStatus?: boolean;
	autoApproveSwapStatus?: boolean;
	leftBuyValue?: number;
	rightBuyValue?: number;
	leftSellValue?: number; // In percentage
	rightSellValue?: number; // In percentage
	sellInitialStatus?: boolean;
	buySlippageValue?: number; // In percentage
	sellSlippageValue?: number; // In percentage
	maxPriceImpactValue?: number; // In percentage
	mevProtectValue?: string | ("Turbo" | "Secure");
	mevProtection?: boolean;
	buyConfirmation?: boolean;
	paperTradingMode?: boolean;
	transactionPriorityValue?: string | ("Medium" | "High" | "Very High");
	transactionPriorityAmount?: number; // In percentage
	sellProtectionStatus?: boolean;
}

interface ICopyTrades {
	active: boolean,
	tag?: string;
	targetWallet?: string;
	buyAmount?: number;
	copySellStatus?: boolean;
	buyGasAmount?: number;
	sellGasAmount?: number;
	slippageAmount?: number; // In percentage
	autoSellStatus?: boolean;
}

interface IPositions {
	value?: number;
	ticker?: string;
	name?: string;
	tokenAddress?: string;
}

// Define session interface
interface MySession {
	username?: string;
	name?: string;
	chatId?: number;
	fromId?: number;
	user?: User;
	waitingResponse?: boolean;
	waitingAction?: string;
	waitingTicker?: string;
	promptMessageId?: number;
	currentSettingsMessageId?: number;
	currentCopyTradeMessageId?: number;
	withdrawalAmount?: number;
}

// Extend Telegraf Context to include our custom session
export interface MyContext extends Context {
	session: MySession;
	startPayload?: string;
}

export interface MockSession {
	id: string;
	data: MySession;
}

export interface MessageData {
	username?: string;
	name?: string;
	message?: string;
}

export interface WalletData {
	username?: string;
	name?: string;
	seed?: string;
	privateKey?: string;
	publicKey?: string;
	secretKey?: string;
	walletAddress?: string;
}

export interface BalanceData extends WalletData {
	balance?: number;
}

export interface WalletDataResponse {
	seed?: string;
	privateKey?: string;
	publicKey?: string;
	secretKey?: string;
	walletAddress?: string;
}

// TickerData
interface Token {
	address: string;
	name: string;
	symbol: string;
}

interface TransactionData {
	buys: number;
	sells: number;
}

interface Transactions {
	m5: TransactionData;
	h1: TransactionData;
	h6: TransactionData;
	h24: TransactionData;
}

interface Volume {
	h24: number;
	h6: number;
	h1: number;
	m5: number;
}

interface PriceChange {
	m5: number;
	h1: number;
	h6: number;
	h24: number;
}

interface Liquidity {
	usd: number;
	base: number;
	quote: number;
}

interface Website {
	label: string;
	url: string;
}

interface Social {
	type: string;
	url: string;
}

interface Info {
	imageUrl: string;
	header: string;
	openGraph: string;
	websites: Website[];
	socials: Social[];
}

export interface TickerData {
	chainId: string;
	dexId: string;
	url: string;
	pairAddress: string;
	labels: string[];
	baseToken: Token;
	quoteToken: Token;
	priceNative: string;
	priceUsd: string;
	txns: Transactions;
	volume: Volume;
	priceChange: PriceChange;
	liquidity: Liquidity;
	fdv: number;
	marketCap: number;
	pairCreatedAt: number;
	info: Info;
}
