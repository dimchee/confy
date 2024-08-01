function aes_from_key(key) {
  if (key == null) key = "";
  const iv = [ 21, 13, 23, 24, 111, 26, 27, 13, 29, 30, 31, 28, 33, 201,35, 36 ];
  key = aesjs.utils.utf8.toBytes(key.padEnd(32, "0"))
  return new aesjs.ModeOfOperation.cbc(key, iv)
}

const key = new URLSearchParams(window.location.search).get("key")

Array.from(document.getElementsByClassName('secret')).forEach(x => {
    x.innerHTML = aesjs.utils.utf8.fromBytes(
        aes_from_key(key).decrypt(aesjs.utils.hex.toBytes(x.innerHTML.trim()))
    );
})
