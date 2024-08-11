#!/usr/bin/env node

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const aesjs = require('aes-js');
const fs = require('node:fs');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const optionDefinitions = [
  { name: 'output', alias: 'o', type: String },
  { name: 'input', alias: 'i', type: String, defaultOption: true },
  { name: 'key', alias: 'k', type: String },
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'local', alias: 'l', type: Boolean },
]
const sections = [
  {
    header: 'Confy <input>.html -o <output>.html -k <secret_key> [--local]',
    content: 'Simple CLI program for storing confidential data on public domains',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'input -i',
        typeLabel: '{underline file}',
        description: 'The input HTML file'
      },
      {
        name: 'output -o',
        typeLabel: '{underline file}',
        description: 'The output HTML file'
      },
      {
        name: 'key -k',
        typeLabel: '{underline string}',
        description: 'Value for key url parameter'
      },
      {
        name: 'help -h',
        description: 'Print this usage guide.'
      },
      {
        name: 'local -l',
        description: 'Makes generated HTML local'
      }
    ]
  }
]
const usage = commandLineUsage(sections)
const args = commandLineArgs(optionDefinitions);

if (!args.input || !args.output || !args.key || args.help) {
  console.log(usage)
  process.exit(0)
}

function aes_from_key(key, nonce) {
  if (key == null) key = "";
  key = aesjs.utils.utf8.toBytes(key.padEnd(32, "\0"))
  return new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(nonce))
}

JSDOM.fromFile(args.input).then(async dom => {
  var document = dom.window.document;
  Array.from(document.getElementsByClassName("secret")).forEach(x => {
    const textBytes = aesjs.utils.utf8.toBytes(x.innerHTML)
    const nonce = crypto.getRandomValues(new Uint8Array(16));
    const encryptedBytes = aes_from_key(args.key, nonce).encrypt(textBytes)
    const encrypted = aesjs.utils.hex.fromBytes(new Uint8Array([...nonce, ...encryptedBytes]));
    console.log(encrypted)
    x.innerHTML = encrypted
  });

  if (args.local) {
    var index = await fetch("https://cdn.rawgit.com/ricmoo/aes-js/e27b99df/index.js")
    var script = await index.text()
    document.body.appendChild(JSDOM.fragment(`<script>${script}</script>`))
  }
  else {
    document.body.appendChild(
      JSDOM.fragment('<script src="https://cdn.rawgit.com/ricmoo/aes-js/e27b99df/index.js"></script>')
    )
  }
  const inject = fs.readFileSync(`${__dirname}/inject.js`, 'utf8')
  document.body.appendChild(JSDOM.fragment(`<script>${inject}</script>`))


  fs.writeFile(args.output, dom.serialize(), err => {
    if (err) {
      console.error(err);
    }
  });
})
