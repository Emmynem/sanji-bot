import { Markup } from "telegraf";
import bot from "../bot";
import { MyContext, TickerData } from "../config/interfaces";
import { isValidSolanaAddress, getTickerDetails, countFilter, calculatePriceImpact, rickBurpBot, solscanNetworkAddress, escapeMarkdownV2 } from "../config";

const refreshTicker = async (ctx: MyContext) => {
	await ctx.answerCbQuery(); // Remove loading animation

	ctx.session.waitingAction = "BUY_TICKER";

	try {
		if (ctx.session.waitingTicker && isValidSolanaAddress(ctx.session.waitingTicker)) {
			const response = await getTickerDetails(ctx.session.waitingTicker);

			if (response.error) {
				return await ctx.reply(`_Unable to get ticker/address details_`, { parse_mode: "MarkdownV2" });
			}

			const details: TickerData = response.data[0];

			await ctx.editMessageText(
				`${details.baseToken.name} \\| ${details.baseToken.symbol} \\|\n`
				+ `\`${details.baseToken.address}\`\n\n`
				+ `[Explorer](${solscanNetworkAddress}${details.baseToken.address}) \\| [Chart](${details.url}) \\| [Scan](${rickBurpBot + details.baseToken.address}) \\|\n\n`
				+ `Price: *$${escapeMarkdownV2(details.priceUsd)}*\n`
				+ `5m: *${details.priceChange.m5 ? escapeMarkdownV2(details.priceChange.m5.toString()) : "NaN"}%*, 1h: *${details.priceChange.h1 ? escapeMarkdownV2(details.priceChange.h1.toString()) : "NaN"}%*, 6h: *${details.priceChange.h6 ? escapeMarkdownV2(details.priceChange.h6.toString()) : "NaN"}%*, 24h: *${details.priceChange.h24 ? escapeMarkdownV2(details.priceChange.h24.toString()) : "NaN"}%*\n`
				+ `MCap: *$${escapeMarkdownV2(countFilter(details.marketCap).toString())}* \\| Liq: *$${escapeMarkdownV2(countFilter(details.liquidity.usd).toString())}*\n\n`
				+ `Price Impact \\(${escapeMarkdownV2((details.liquidity.base * calculatePriceImpact(details.liquidity.base, details.liquidity.quote, (ctx.session.user?.settings.leftBuyValue ?? 0) && (ctx.session.user?.settings.rightBuyValue ?? 0) && (ctx.session.user?.settings.leftBuyValue ?? 0) < (ctx.session.user?.settings.rightBuyValue ?? 0) ? (ctx.session.user?.settings.leftBuyValue ?? 0) : (ctx.session.user?.settings.rightBuyValue ?? 0)) / 100).toFixed(3).toString())} SOL\\): *${escapeMarkdownV2(calculatePriceImpact(details.liquidity.base, details.liquidity.quote, (ctx.session.user?.settings.leftBuyValue ?? 0) && (ctx.session.user?.settings.rightBuyValue ?? 0) && (ctx.session.user?.settings.leftBuyValue ?? 0) < (ctx.session.user?.settings.rightBuyValue ?? 0) ? (ctx.session.user?.settings.leftBuyValue ?? 0) : (ctx.session.user?.settings.rightBuyValue ?? 0)).toFixed(2))}%*\n\n`
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
		}
	} catch (err) {
		// await ctx.reply(`_Unable to get ticker details_`, { parse_mode: "MarkdownV2" });
	}

	// Optional: Clear session after capturing response
	delete ctx.session.waitingAction;
};

export default refreshTicker;