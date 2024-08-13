#!/usr/bin/env node

const crypto = require("node:crypto").webcrypto;
const { JSDOM } = require("jsdom");
const { readFile, writeFile } = require("node:fs/promises");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const { getKey, encrypt, buf2hex } = require("./common.js");

const optionDefinitions = [
	{ name: "output", alias: "o", type: String },
	{ name: "input", alias: "i", type: String, defaultOption: true },
	{ name: "key", alias: "k", type: String },
	{ name: "help", alias: "h", type: Boolean },
];
const sections = [
	{
		header: "Confy <input>.html -o <output>.html -k <secret_key>",
		content:
			"Simple CLI program for storing confidential data on public domains",
	},
	{
		header: "Options",
		optionList: [
			{
				name: "input -i",
				typeLabel: "{underline file}",
				description: "The input HTML file",
			},
			{
				name: "output -o",
				typeLabel: "{underline file}",
				description: "The output HTML file",
			},
			{
				name: "key -k",
				typeLabel: "{underline string}",
				description: "Value for key url parameter",
			},
			{
				name: "help -h",
				description: "Print this usage guide.",
			},
		],
	},
];
const usage = commandLineUsage(sections);
const args = commandLineArgs(optionDefinitions);

if (!args.input || !args.output || !args.key || args.help) {
	console.log(usage);
	process.exit(0);
}

JSDOM.fromFile(args.input).then(async (dom) => {
	const document = dom.window.document;
	const enc = new TextEncoder();
	const key = await getKey(enc.encode(args.key), enc.encode("salty"));
	for (const x of document.getElementsByClassName("secret")) {
		const iv = crypto.getRandomValues(new Uint8Array(16));
		const cipherText = await encrypt(enc.encode(x.innerHTML), key, iv);
		x.innerHTML = buf2hex(iv) + buf2hex(cipherText);
	}
	const commonJS = await readFile(`${__dirname}/common.js`, "utf8");
	document.body.appendChild(JSDOM.fragment(`<script>${commonJS}</script>`));
	const injectJS = await readFile(`${__dirname}/inject.js`, "utf8");
	document.body.appendChild(JSDOM.fragment(`<script>${injectJS}</script>`));
	await writeFile(args.output, dom.serialize());
});
