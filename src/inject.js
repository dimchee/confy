function aes_from_key(key, nonce) {
    if (key == null) key = "";
    key = aesjs.utils.utf8.toBytes(key.padEnd(32, "\0"))
    return new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(nonce))
}

const key = new URLSearchParams(window.location.search).get("key")

Array.from(document.getElementsByClassName('secret')).forEach(x => {
    const content = x.innerHTML.trim();
    const nonce = aesjs.utils.hex.toBytes(content.slice(0, 32));
    const ciphertext = aesjs.utils.hex.toBytes(content.slice(32));
    x.innerHTML = aesjs.utils.utf8.fromBytes(
        aes_from_key(key, nonce).decrypt(ciphertext)
    );
})
