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
];
const sections = [
  {
    header: 'Confy',
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
        description: 'value for key url parameter'
      },
      {
        name: 'help -h',
        description: 'Print this usage guide.'
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

function aes_from_key(key) {
  if (key == null) key = "";
  key = aesjs.utils.utf8.toBytes(key.padEnd(32, "0"))
  return new aesjs.ModeOfOperation.ctr(key)
}

JSDOM.fromFile(args.input).then(dom => {
  var document = dom.window.document;
  Array.from(document.getElementsByClassName("secret")).forEach(x => {
    var textBytes = aesjs.utils.utf8.toBytes(x.innerHTML)
    var encrypted = aesjs.utils.hex.fromBytes(
        aes_from_key(args.key).encrypt(textBytes)
    );
    console.log(encrypted)
    x.innerHTML = encrypted
  });
  document.body.appendChild(
    JSDOM.fragment('<script type="text/javascript" src="https://cdn.rawgit.com/ricmoo/aes-js/e27b99df/index.js"></script>')
  )
  const inject = fs.readFileSync(`${__dirname}/inject.js`, 'utf8')
  document.body.appendChild(JSDOM.fragment(`<script>${inject}</script>`))
  
  
  fs.writeFile(args.output, dom.serialize(), err => {
    if (err) {
      console.error(err);
    }
  });
})
