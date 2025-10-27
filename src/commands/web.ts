import { MyContext } from "../config/interfaces";

const web = async (ctx: MyContext) => {

	await ctx.reply(`https://sanji.app/`);
};

export default web;