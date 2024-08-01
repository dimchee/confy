function aes_from_key(key) {
  if (key == null) key = "";
  key = aesjs.utils.utf8.toBytes(key.padEnd(32, "0"))
  return new aesjs.ModeOfOperation.ctr(key)
}

const key = new URLSearchParams(window.location.search).get("key")

Array.from(document.getElementsByClassName('secret')).forEach(x => {
    x.innerHTML = aesjs.utils.utf8.fromBytes(
        aes_from_key(key).decrypt(aesjs.utils.hex.toBytes(x.innerHTML.trim()))
    );
})
