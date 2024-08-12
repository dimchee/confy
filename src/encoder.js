#!/usr/bin/env node

const crypto = require('crypto').webcrypto
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const fs = require('node:fs')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const optionDefinitions = [
  { name: 'output', alias: 'o', type: String },
  { name: 'input', alias: 'i', type: String, defaultOption: true },
  { name: 'key', alias: 'k', type: String },
  { name: 'help', alias: 'h', type: Boolean },
]
const sections = [
  {
    header: 'Confy <input>.html -o <output>.html -k <secret_key>',
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
    ]
  }
]
const usage = commandLineUsage(sections)
const args = commandLineArgs(optionDefinitions)

if (!args.input || !args.output || !args.key || args.help) {
  console.log(usage)
  process.exit(0)
}


async function getKey(password, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    password,
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"],
  )
  return await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 12345, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt", "decrypt"],
  )
}

async function encrypt(plaintext, key, iv) {
  return crypto.subtle.encrypt( { name: "AES-CBC", iv }, key, plaintext)
}
async function decrypt(ciphertext, key, iv) {
  return crypto.subtle.decrypt( { name: "AES-CBC", iv }, key, ciphertext)
}


function buf2hex(buffer) {
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}
function hex2buf(str) {
  return new Uint8Array(
    str.split('')
      .map((el, ix, arr) => ix % 2 ? null : el + arr[ix + 1])
      .filter(el => el !== null)
      .map(x => parseInt(x, 16))
  )
}

JSDOM.fromFile(args.input).then(async dom => {
  var document = dom.window.document
  const enc = new TextEncoder()
  const key = await getKey(enc.encode(args.key), enc.encode("salty"))
  for (const x of document.getElementsByClassName("secret")) {
    const iv = await crypto.getRandomValues(new Uint8Array(16))
    const cipherText = await encrypt(enc.encode(x.innerHTML), key, iv)
    x.innerHTML = buf2hex(iv) + buf2hex(cipherText)
  }
  const inject = fs.readFileSync(`${__dirname}/inject.js`, 'utf8')
  document.body.appendChild(JSDOM.fragment(`<script>${inject}</script>`))


  fs.writeFile(args.output, dom.serialize(), err => {
    if (err) {
      console.error(err)
    }
  })
})
