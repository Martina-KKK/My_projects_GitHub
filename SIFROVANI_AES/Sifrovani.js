const encryptButton = document.getElementById('encryptButton');
const decryptButton = document.getElementById('decryptButton');
const messageInput = document.getElementById('message');
const encryptionKeyInput = document.getElementById('encryptionKey');
const encryptedTextOutput = document.getElementById('encryptedText');
const decryptedTextOutput = document.getElementById('decryptedText');

// testovaci klic
//const encryptionKey = 'MujNejSkvelySuperTajnyKlic256bit';

// OK test
// Funkce pro sifrovani textu
function encryptText(text, key) {
  // generovani nahodneho inicializacniho vektoru (IV)
  const iv = CryptoJS.lib.WordArray.random(16);
  // sifrovani textu pomoci algoritmu AES s CBC rezimem
  const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });
  // kombinace IV a sifrovaneho textu do jednoho vystupu
  const ivAndCiphertext = iv.concat(encrypted.ciphertext);
  // prevod vystupu na format Base64
  return ivAndCiphertext.toString(CryptoJS.enc.Base64);
}

// Funkce pro desifrovani textu
function decryptText(encryptedText, key) {
  if (!encryptedText) {
    return "Chybí zašifrovaný text!";
  }
  // parsovani zasifrovaneho textu z formatu Base64 na CryptoJS WordArray
  const rawData = CryptoJS.enc.Base64.parse(encryptedText);
  // ziskani inicializacniho vektoru (IV) z prvnich 16 bytu zasifrovaneho textu
  const ivBuffer = new ArrayBuffer(16);
  const ivView = new DataView(ivBuffer);
  for (let i = 0; i < 4; i++) {
    ivView.setUint32(i * 4, rawData.words[i]);
  }
  // ziskani zbyleho sifrovaneho textu bez IV
  const ciphertextBuffer = new ArrayBuffer(rawData.sigBytes - 16);
  const ciphertextView = new DataView(ciphertextBuffer);
  for (let i = 0; i < ciphertextBuffer.byteLength; i++) {
    ciphertextView.setUint8(i, rawData.words[i + 4]);
  }
  // vytvoreni CryptoJS WordArray pro IV a sifrovany text
  const iv = CryptoJS.lib.WordArray.create(ivBuffer);
  const ciphertext = CryptoJS.lib.WordArray.create(ciphertextBuffer);
  // vytvoreni objektu s parametry pro desifrovani
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: ciphertext
  });
  // desifrovani textu pomoci algoritmu AES s CBC rezimem
  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv: iv });
  // prevod desifrovaneho textu na UTF-8 retezec
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/*
// OK test
// Funkce pro šifrování textu
function encryptText(text, key) {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });
  return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}

// Funkce pro dešifrování textu
function decryptText(encryptedText, key) {
  const rawData = CryptoJS.enc.Base64.parse(encryptedText);
  const iv = CryptoJS.lib.WordArray.create(rawData.words.slice(0, 4));
  const ciphertext = CryptoJS.lib.WordArray.create(rawData.words.slice(4));
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: ciphertext
  });
  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv: iv });
  return decrypted.toString(CryptoJS.enc.Utf8);
}*/
/*
// Příklad použití
const plaintext = 'Toto je tajná zpráva!';
const encryptionKey = 'SuperTajnyKlic256bit';

// Šifrování
const encrypted = encryptText(plaintext, encryptionKey);
console.log('Zašifrovaný text:', encrypted);

// Dešifrování
const decrypted = decryptText(encrypted, encryptionKey);
console.log('Dešifrovaný text:', decrypted);
*/
/*
// OK test
// Funkce pro šifrování textu
function encryptText(text, key) {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });
  return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}

// Funkce pro dešifrování textu
function decryptText(encryptedText, key) {
  const rawData = CryptoJS.enc.Base64.parse(encryptedText);
  const iv = CryptoJS.enc.Hex.parse(rawData.words.slice(0, 4).map(word => word.toString(16)).join(''));
  const ciphertext = CryptoJS.enc.Hex.parse(rawData.words.slice(4).map(word => word.toString(16)).join(''));
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: ciphertext
  });
  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv: iv });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
*/


// ovladaci udalost pro tlacitko "Zasifrovat"
encryptButton.addEventListener('click', () => {
  const message = messageInput.value;
  const encryptionKey = encryptionKeyInput.value;
  const encrypted = encryptText(message, encryptionKey);
  encryptedTextOutput.textContent = 'Zašifrovaný text: ' + encrypted;
  decryptedTextOutput.textContent = ''; // vynulovani vystupu pro desifrovany text
  decryptButton.disabled = false; // aktivovani tlacitka Desifrovat
  encryptButton.disabled = true;  // deaktivovani tlacitka Zasifrovat
});

// ovladaci udalost pro tlacitko "Desifrovat"
decryptButton.addEventListener('click', () => {
  //const message = messageInput.value;
  const encryptedText = messageInput.value; // vstupni text je zasifrovany text
  const encryptionKey = encryptionKeyInput.value;
  //const decrypted = decryptText(message, encryptionKey);
  const decrypted = decryptText(encryptedText, encryptionKey);
  decryptedTextOutput.textContent = 'Dešifrovaný text: ' + decrypted;
  encryptedTextOutput.textContent = ''; // vynulovani vystupu pro desifrovany text
  encryptButton.disabled = false; // aktivovani tlacitka Zasifrovat
  decryptButton.disabled = true;  // deaktivovani tlacitka Desifrovat
});
