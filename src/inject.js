const crypto = window.crypto

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


async function main() {
  const password = new URLSearchParams(window.location.search).get("key");
  for (const x of document.getElementsByClassName('secret')) {
    const dec = new TextDecoder()
    const enc = new TextEncoder()
    const content = x.innerHTML
    const key = await getKey(enc.encode(password), enc.encode("salty"))
    const iv = hex2buf(content.slice(0, 32))
    const cipherText = hex2buf(content.slice(32))
    try {
      const plainText = await decrypt(cipherText, key, iv)  
      x.innerHTML = dec.decode(plainText)
    } catch (error) {} 
  }
}

main()
