const crypto = window.crypto;

async function main() {
	const password = new URLSearchParams(window.location.search).get("key");
	for (const x of Array.from(document.getElementsByClassName("secret"))) {
		const dec = new TextDecoder();
		const enc = new TextEncoder();
		const content = x.innerHTML;
		const key = await getKey(enc.encode(password), enc.encode("salty"));
		const iv = hex2buf(content.slice(0, 32));
		const cipherText = hex2buf(content.slice(32));
		try {
			const plainText = await decrypt(cipherText, key, iv);
			x.innerHTML = dec.decode(plainText);
			x.classList.remove(["secret"]);
			x.classList.add(["unlocked"]);
		} catch (error) {
			console.log(error);
		}
	}
}

main();
