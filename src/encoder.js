const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const aesjs = require('aes-js');
const fs = require('node:fs');

var [key, b] = process.argv.slice(2)
console.log (`key: ${key} b: ${b}`)


function aes_from_key(key) {
  if (key == null) key = "";
  key = aesjs.utils.utf8.toBytes(key.padEnd(32, "0"))
  return new aesjs.ModeOfOperation.ctr(key)
}

JSDOM.fromFile('examples/example.html').then(dom => {
  var document = dom.window.document;
  Array.from(document.getElementsByClassName("secret")).forEach(x => {
    var textBytes = aesjs.utils.utf8.toBytes(x.innerHTML)
    var encrypted = aesjs.utils.hex.fromBytes(
        aes_from_key(key)?.encrypt(textBytes)
    );
    console.log(encrypted)
    x.innerHTML = encrypted
  });
  document.body.appendChild(
    JSDOM.fragment('<script type="text/javascript" src="https://cdn.rawgit.com/ricmoo/aes-js/e27b99df/index.js"></script>')
  )
  document.body.appendChild(JSDOM.fragment('<script src="src/inject.js"></script>'))
  
  
  fs.writeFile('out.html', dom.serialize(), err => {
    if (err) {
      console.error(err);
    }
  });
})
