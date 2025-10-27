import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { MyContext } from "./config/interfaces";

// Import Commands
import start from "./commands/start";
import web from "./commands/web";
import buy from "./commands/buy";
import burn from "./commands/burn";
import referral from "./commands/referral";
import settings from "./commands/settings";
import help from "./commands/help";
import legal from "./commands/legal";
import alpha from "./commands/alpha";
import backup from "./commands/backup";
import morebots from "./commands/morebots";

import wallet from "./commands/wallet";
import copyTrade from "./commands/copyTrade";
// End - Import Commands

// Import Actions

// Wallet
import confirmDeleteWallet from "./actions/wallet/confirmDeleteWallet";
import confirmedDeleteWallet from "./actions/wallet/confirmedDeleteWallet";
import createWallet from "./actions/wallet/createWallet";
import deleteWallet from "./actions/wallet/deleteWallet";
import deposit from "./actions/wallet/deposit";
import importWallet from "./actions/wallet/importWallet";
import privateKeyImport from "./actions/wallet/privateKeyImport";
import refreshWallet from "./actions/wallet/refreshWallet";
import seedPhraseImport from "./actions/wallet/seedPhraseImport";
import sell from "./actions/wallet/sell";
import showPrivateKey from "./actions/wallet/showPrivateKey";
import withdraw from "./actions/wallet/withdraw";

// Settings
import language from "./actions/settings/language";
import autoBuy from "./actions/settings/autoBuy";
import autoApproveSwap from "./actions/settings/autoApproveSwap";
import instantRugExit from "./actions/settings/instantRugExit";
import sellInitial from "./actions/settings/sellInitial";
import sellProtection from "./actions/settings/sellProtection";
import mevProtect from "./actions/settings/mevProtect";
import transactionPriorityValue from "./actions/settings/transactionPriorityValue";
import minimumPositionValue from "./actions/settings/minimumPositionValue";
import autoBuyValue from "./actions/settings/autoBuyValue";
import buySlippageValue from "./actions/settings/buySlippageValue";
import leftBuyValue from "./actions/settings/leftBuyValue";
import rightBuyValue from "./actions/settings/rightBuyValue";
import leftSellValue from "./actions/settings/leftSellValue";
import rightSellValue from "./actions/settings/rightSellValue";
import maxPriceImpactValue from "./actions/settings/maxPriceImpactValue";
import sellSlippageValue from "./actions/settings/sellSlippageValue";
import transactionPriorityAmount from "./actions/settings/transactionPriorityAmount";
import mevProtection from "./actions/settings/mevProtection";
import buyConfirmation from "./actions/settings/buyConfirmation";
import paperTradingMode from "./actions/settings/paperTradingMode";
import universalTradeSettings from "./actions/settings/universalTradeSettings";
import copyTradeSettings from "./actions/settings/copyTradeSettings";
import presetSettings from "./actions/settings/presetSettings";
import priorityFee from "./actions/settings/priorityFee";

// Main
import accepted from "./actions/accepted";
import hears from "./actions/hears";
import leftBuy from "./actions/leftBuy";
import limitOrders from "./actions/limitOrders";
import myTrades from "./actions/myTrades";
import positions from "./actions/positions";
import refresh from "./actions/refresh";
import refreshTicker from "./actions/refreshTicker";
import rightBuy from "./actions/rightBuy";
import xBuy from "./actions/xBuy";

// Copy Trades
import pauseAll from "./actions/copytrades/pauseAll";
import activateAll from "./actions/copytrades/activateAll";
import clearAll from "./actions/copytrades/clearAll";
import newCopyTrade from './actions/copytrades/newCopyTrade';
import addCopyTrade from './actions/copytrades/addCopyTrade';
import autoSell from './actions/copytrades/autoSell';
import buyAmount from './actions/copytrades/buyAmount';
import buyGasAmount from './actions/copytrades/buyGasAmount';
import copySell from './actions/copytrades/copySell';
import sellGasAmount from './actions/copytrades/sellGasAmount';
import slippageAmount from './actions/copytrades/slippageAmount';
import tag from './actions/copytrades/tag';
import targetWallet from './actions/copytrades/targetWallet';

// Referrals
import feeReceiverWallet from './actions/referrals/feeReceiverWallet';
import customReferralCode from './actions/referrals/customReferralCode';
import shareReferralLink from './actions/referrals/shareReferralLink';

// Positions
import myTokens from './actions/positions/myTokens';
import myTradesAlt from './actions/positions/myTradesAlt';
import tradeConfigs from './actions/positions/tradeConfigs';
import tradeHistory from './actions/positions/tradeHistory';

// Defaults
import dashes from "./actions/defaults/dashes";
import close from "./actions/defaults/close";

// End - Import Actions

import dotenv from 'dotenv';
dotenv.config();

const { BOT_TOKEN, BOT_TOKEN_TEST } = process.env;

const NODE_ENV: string = process.env.NODE_ENV || "development";

const bot = new Telegraf<MyContext>((NODE_ENV === "development" ? BOT_TOKEN_TEST : BOT_TOKEN) || "");

// Commands Regex
const startRegExp = /^(start)$/i;
const webRegExp = /^(web)$/i;
const menuRegExp = /^(menu)$/i;
const buyRegExp = /^(buy)$/i;
const sellRegExp = /^(sell)$/i;
const burnRegExp = /^(burn)$/i;
const referralRegExp = /^(referral)$/i;
const settingsRegExp = /^(settings)$/i;
const helpRegExp = /^(help)$/i;
const legalRegExp = /^(legal)$/i;
const alphaRegExp = /^(alpha)$/i;
const backupRegExp = /^(backup)$/i;
const morebotsRegExp = /^(morebots)$/i;

// Actions Regex
const walletRegExp = /^(WALLET)$/i;
const createWalletRegExp = /^(CREATE_WALLET)$/i;
const importWalletRegExp = /^(IMPORT_WALLET)$/i;
const seedPhraseImportRegExp = /^(SEED_PHRASE_IMPORT)$/i;
const privateKeyImportRegExp = /^(PRIVATE_KEY_IMPORT)$/i;
const refreshWalletRegExp = /^(REFRESH_WALLET)$/i;
const confirmDeleteWalletRegExp = /^(CONFIRM_DELETE_WALLET)$/i;
const confirmedDeleteWalletRegExp = /^(CONFIRMED_DELETE_WALLET)$/i;
const deleteWalletRegExp = /^(DELETE_WALLET)$/i;
const showPrivateKeyRegExp = /^(SHOW_PRIVATE_KEY)$/i;
const depositRegExp = /^(DEPOSIT)$/i;
const withdrawRegExp = /^(WITHDRAW)$/i;
const sellOrManageRegExp = /^(SELL_MANAGE)$/i;
const closeRegExp = /^(CLOSE)$/i;
const refreshRegExp = /^(REFRESH)$/i;
const acceptRegExp = /^(ACCEPT)$/i;
// const settingsRegExp = /^(SETTINGS)$/i;
const dashesRegExp = /^(DASHES)$/i;
const languageRegExp = /^(SETTINGS_UPDATE_LANAGUAGE)$/i;
const mevProtectionRegExp = /^(SETTINGS_UPDATE_MEV_PROTECTION)$/i;
const buyConfirmationRegExp = /^(SETTINGS_UPDATE_BUY_CONFIRMATION)$/i;
const paperTradingModeRegExp = /^(SETTINGS_UPDATE_PAPER_TRADING_MODE)$/i;
const universalTradeSettingsRegExp = /^(UNIVERSAL_TRADE_SETTINGS)$/i;
const copyTradeSettingsRegExp = /^(COPY_TRADE_SETTINGS)$/i;
const presetSettingsRegExp = /^(PRESET_SETTINGS)$/i;
const priorityFeeRegExp = /^(PRIORITY_FEE)$/i;
const autoBuyRegExp = /^(SETTINGS_UPDATE_AUTO_BUY_STATUS)$/i;
const autoApproveSwapRegExp = /^(SETTINGS_UPDATE_AUTO_APPROVE_SWAP_STATUS)$/i;
const instantRugExitRegExp = /^(SETTINGS_UPDATE_INSTANT_RUG_EXIT_STATUS)$/i;
const sellInitialRegExp = /^(SETTINGS_UPDATE_SELL_INITIAL_STATUS)$/i;
const sellProtectionRegExp = /^(SETTINGS_UPDATE_SELL_PROTECTION_STATUS)$/i;
const mevProtectRegExp = /^(SETTINGS_UPDATE_MEV_PROTECT)$/i;
const transactionPriorityValueRegExp = /^(SETTINGS_UPDATE_TRANSACTION_PRIORITY_VALUE)$/i;
const minimumPositionValueRegExp = /^(SETTINGS_UPDATE_MINIMUM_POSITION_VALUE)$/i;
const autoBuyValueRegExp = /^(SETTINGS_UPDATE_AUTO_BUY_VALUE)$/i;
const buySlippageValueRegExp = /^(SETTINGS_UPDATE_BUY_SLIPPAGE_VALUE)$/i;
const leftBuyValueRegExp = /^(SETTINGS_UPDATE_LEFT_BUY_VALUE)$/i;
const rightBuyValueRegExp = /^(SETTINGS_UPDATE_RIGHT_BUY_VALUE)$/i;
const leftSellValueRegExp = /^(SETTINGS_UPDATE_LEFT_SELL_VALUE)$/i;
const rightSellValueRegExp = /^(SETTINGS_UPDATE_RIGHT_SELL_VALUE)$/i;
const maxPriceImpactValueRegExp = /^(SETTINGS_UPDATE_MAX_PRICE_IMPACT_VALUE)$/i;
const sellSlippageValueRegExp = /^(SETTINGS_UPDATE_SELL_SLIPPAGE_VALUE)$/i;
const transactionPriorityAmountRegExp = /^(SETTINGS_UPDATE_TRANSACTION_PRIORITY_AMOUNT)$/i;
const refreshTickerRegExp = /^(REFRESH_BUY_TICKER)$/i;
const leftBuyRegExp = /^(BUY_TOKEN_LEFT_VALUE)$/i;
const xBuyRegExp = /^(BUY_TOKEN_X_VALUE)$/i;
const rightBuyRegExp = /^(BUY_TOKEN_RIGHT_VALUE)$/i;
const copytradeRegExp = /^(COPYTRADE)$/i;
const pauseAllRegExp = /^(PAUSE_COPY_TRADES)$/i;
const activateAllRegExp = /^(ACTIVATE_COPY_TRADES)$/i;
const clearAllRegExp = /^(CLEAR_COPY_TRADES)$/i;
const newCopyTradeRegExp = /^(NEW_COPY_TRADE)$/i;
const tagRegExp = /^(NEW_COPY_TRADE_TAG)$/i;
const targetWalletRegExp = /^(NEW_COPY_TRADE_TARGET_WALLET)$/i;
const buyAmountRegExp = /^(NEW_COPY_TRADE_BUY_AMOUNT)$/i;
const copySellRegExp = /^(NEW_COPY_TRADE_COPY_SELL)$/i;
const buyGasAmountRegExp = /^(NEW_COPY_TRADE_BUY_GAS_AMOUNT)$/i;
const sellGasAmountRegExp = /^(NEW_COPY_TRADE_SELL_GAS_AMOUNT)$/i;
const slippageAmountRegExp = /^(NEW_COPY_TRADE_SLIPPAGE_AMOUNT)$/i;
const autoSellRegExp = /^(NEW_COPY_TRADE_AUTO_SELL)$/i;
const addCopyTradeRegExp = /^(NEW_COPY_TRADE_ADD)$/i;
const feeReceiverWalletRegExp = /^(SET_FEE_RECEIVER_WALLET)$/i;
const customReferralCodeRegExp = /^(SET_CUSTOM_REFERRAL_CODE)$/i;
const shareReferralLinkRegExp = /^(SHARE_REFERRAL_LINK)$/i;
const positionsRegExp = /^(POSITIONS)$/i;
const myTradesRegExp = /^(MY_TRADES)$/i;
const limitOrdersRegExp = /^(LIMIT_ORDERS)$/i;
const myTokensRegExp = /^(MY_TOKENS)$/i;
const myTradesAltRegExp = /^(MY_TRADES_ALT)$/i;
const tradeHistoryRegExp = /^(TRADE_HISTORY)$/i;
const tradeConfigsRegExp = /^(TRADE_CONFIGS)$/i;

// Use session middleware (Local Storage)
bot.use((new LocalSession({ database: 'session.json' })).middleware());

(async () => {
	const existingCommands = await bot.telegram.getMyCommands();

	if (existingCommands.length === 0) {
		bot.telegram.setMyCommands([
			{
				command: "start",
				description: "Start the bot"
			},
			{
				command: "web",
				description: "Open sanji web terminal"
			},
			{
				command: "menu",
				description: "Go to the main menu or run the bot"
			},
			{
				command: "buy",
				description: "Buy token with CA"
			},
			{
				command: "sell",
				description: "Open sell token menu"
			},
			{
				command: "burn",
				description: "Burn(close) zero balance token accounts and claim 0.002 sol each"
			},
			{
				command: "referral",
				description: "Go to referrals menu"
			},
			{
				command: "settings",
				description: "Go to settings menu"
			},
			{
				command: "help",
				description: "Help"
			},
			{
				command: "legal",
				description: "Legal Documents"
			},
			{
				command: "alpha",
				description: "Sends a message with a direct link to our alpha bot"
			},
			{
				command: "backup",
				description: "Sends a message listing all our backup bots"
			},
			{
				command: "morebots",
				description: "Sends a message listing all of our bots"
			},
		]);
		console.log("Commands set successfully.");
	} else {
		console.log("Commands already exist, skipping setup.");
	}
})();

// Commands
bot.start(start);

bot.hears(startRegExp, start);
bot.command(startRegExp, start);
bot.action(startRegExp, start);

bot.hears(menuRegExp, start);
bot.command(menuRegExp, start);
bot.action(menuRegExp, start);

bot.hears(webRegExp, web);
bot.command(webRegExp, web);
bot.action(webRegExp, web);

bot.hears(burnRegExp, burn);
bot.command(burnRegExp, burn);
bot.action(burnRegExp, burn);

bot.hears(walletRegExp, wallet);
bot.command(walletRegExp, wallet);
bot.action(walletRegExp, wallet);

bot.hears(buyRegExp, buy);
bot.command(buyRegExp, buy);
bot.action(buyRegExp, buy);

bot.hears(sellRegExp, sell);
bot.command(sellRegExp, sell);
bot.action(sellRegExp, sell);

bot.hears(referralRegExp, referral);
bot.command(referralRegExp, referral);
bot.action(referralRegExp, referral);

bot.hears(helpRegExp, help);
bot.command(helpRegExp, help);
bot.action(helpRegExp, help);

bot.hears(legalRegExp, legal);
bot.command(legalRegExp, legal);
bot.action(legalRegExp, legal);

bot.hears(alphaRegExp, alpha);
bot.command(alphaRegExp, alpha);
bot.action(alphaRegExp, alpha);

bot.hears(backupRegExp, backup);
bot.command(backupRegExp, backup);
bot.action(backupRegExp, backup);

bot.hears(morebotsRegExp, morebots);
bot.command(morebotsRegExp, morebots);
bot.action(morebotsRegExp, morebots);

bot.hears(settingsRegExp, settings);
bot.command(settingsRegExp, settings);
bot.action(settingsRegExp, settings);

// End - Commands

// Actions 
bot.action(closeRegExp, close);
bot.action(refreshRegExp, refresh);
bot.action(acceptRegExp, accepted);

bot.action(positionsRegExp, positions);
bot.action(myTradesRegExp, myTrades);
bot.action(limitOrdersRegExp, limitOrders);

// Position Actions
bot.action(myTokensRegExp, myTokens);
bot.action(myTradesAltRegExp, myTradesAlt);
bot.action(tradeHistoryRegExp, tradeHistory);
bot.action(tradeConfigsRegExp, tradeConfigs);

// Wallet Actions
bot.action(createWalletRegExp, createWallet);
bot.action(confirmDeleteWalletRegExp, confirmDeleteWallet);
bot.action(confirmedDeleteWalletRegExp, confirmedDeleteWallet);
bot.action(deleteWalletRegExp, deleteWallet);
bot.action(showPrivateKeyRegExp, showPrivateKey);
bot.action(importWalletRegExp, importWallet);
bot.action(seedPhraseImportRegExp, seedPhraseImport);
bot.action(privateKeyImportRegExp, privateKeyImport);
bot.action(refreshWalletRegExp, refreshWallet);
bot.action(depositRegExp, deposit);
bot.action(withdrawRegExp, withdraw);
bot.action(sellOrManageRegExp, sell);

// Settings Actions
bot.action(dashesRegExp, dashes);
bot.action(languageRegExp, language);
bot.action(mevProtectionRegExp, mevProtection);
bot.action(buyConfirmationRegExp, buyConfirmation);
bot.action(paperTradingModeRegExp, paperTradingMode);
bot.action(universalTradeSettingsRegExp, universalTradeSettings);
bot.action(copyTradeSettingsRegExp, copyTradeSettings);
bot.action(presetSettingsRegExp, presetSettings);
bot.action(priorityFeeRegExp, priorityFee);
bot.action(autoBuyRegExp, autoBuy);
bot.action(autoApproveSwapRegExp, autoApproveSwap);
bot.action(instantRugExitRegExp, instantRugExit);
bot.action(sellInitialRegExp, sellInitial);
bot.action(sellProtectionRegExp, sellProtection);
bot.action(mevProtectRegExp, mevProtect);
bot.action(transactionPriorityValueRegExp, transactionPriorityValue);
bot.action(minimumPositionValueRegExp, minimumPositionValue);
bot.action(autoBuyValueRegExp, autoBuyValue);
bot.action(buySlippageValueRegExp, buySlippageValue);
bot.action(leftBuyValueRegExp, leftBuyValue);
bot.action(rightBuyValueRegExp, rightBuyValue);
bot.action(leftSellValueRegExp, leftSellValue);
bot.action(rightSellValueRegExp, rightSellValue);
bot.action(maxPriceImpactValueRegExp, maxPriceImpactValue);
bot.action(sellSlippageValueRegExp, sellSlippageValue);
bot.action(transactionPriorityAmountRegExp, transactionPriorityAmount);

// Copy Trade Actions
bot.action(copytradeRegExp, copyTrade);
bot.action(pauseAllRegExp, pauseAll);
bot.action(activateAllRegExp, activateAll);
bot.action(clearAllRegExp, clearAll);
bot.action(newCopyTradeRegExp, newCopyTrade);
bot.action(tagRegExp, tag);
bot.action(targetWalletRegExp, targetWallet);
bot.action(buyAmountRegExp, buyAmount);
bot.action(copySellRegExp, copySell);
bot.action(buyGasAmountRegExp, buyGasAmount);
bot.action(sellGasAmountRegExp, sellGasAmount);
bot.action(slippageAmountRegExp, slippageAmount);
bot.action(autoSellRegExp, autoSell);
bot.action(addCopyTradeRegExp, addCopyTrade);

// Referrals
bot.action(feeReceiverWalletRegExp, feeReceiverWallet);
bot.action(customReferralCodeRegExp, customReferralCode);
bot.action(shareReferralLinkRegExp, shareReferralLink);

// All Listening hears
bot.hears(/.*/, hears);

// Ticker Actions
bot.action(refreshTickerRegExp, refreshTicker);
bot.action(leftBuyRegExp, leftBuy);
bot.action(rightBuyRegExp, rightBuy);
bot.action(xBuyRegExp, xBuy);

// End - Actions

export default bot;