console.log(window.location)
var key = aesjs.utils.utf8.toBytes(new URLSearchParams(window.location.search).get("key"));


var key = Array(...key).concat(Array(32).fill(0)).slice(0,32);

// var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];


var decryptedText = aesjs.utils.utf8.fromBytes(new aesjs.ModeOfOperation.ctr(key).decrypt(aesjs.utils.hex.toBytes(document.getElementById('msg').innerHTML.trim())));

console.log(decryptedText);

document.getElementById('msg').innerHTML = decryptedText


document.getElementById('to_encrypt').onchange = function (event) {
  var textBytes = aesjs.utils.utf8.toBytes(event.target.value)
  var encrypted = aesjs.utils.hex.fromBytes(new aesjs.ModeOfOperation.ctr(key).encrypt(textBytes));
  var decrypted = aesjs.utils.utf8.fromBytes(new aesjs.ModeOfOperation.ctr(key).decrypt(aesjs.utils.hex.toBytes(encrypted)));
  document.getElementById('encrypted').innerHTML = encrypted
  console.log(encrypted);
  console.log(decrypted);
}

