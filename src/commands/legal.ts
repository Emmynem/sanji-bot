import { MyContext } from "../config/interfaces";

const legal = async (ctx: MyContext) => {

	await ctx.reply(`Please use the link below to view our legal terms of use + privacy policy & other legal documents: https://docs.sanjibot.io/legal-documents/terms-of-use`, { link_preview_options: { is_disabled: true } });
};

export default legal;