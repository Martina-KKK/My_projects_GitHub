const encryptButton = document.getElementById('encryptButton');
const decryptButton = document.getElementById('decryptButton');
const messageInput = document.getElementById('message');
const encryptionKeyInput = document.getElementById('encryptionKey');
const encryptedTextOutput = document.getElementById('encryptedText');
const decryptedTextOutput = document.getElementById('decryptedText');

// import potrebne knihovny
//const CryptoJS = require('crypto-js');

// funkce pro sifrovani textu
function encryptText(text, key) {
  // prevod textu na pole bytu
  const textBytes = CryptoJS.enc.Utf8.parse(text);
  // generovani nahodneho inicializacniho vektoru (IV)
  const iv = CryptoJS.lib.WordArray.random(16);
  // sifrovaci algoritmus AES s 256bit klicem a CBC rezimem
  const cipherText = CryptoJS.AES.encrypt(textBytes, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    keySize: 256 / 32,
    padding: CryptoJS.pad.Pkcs7
  });
  // kombinace IV a sifrovaneho textu do jednoho vystupu
  const encrypted = iv.concat(cipherText.ciphertext);
  // prevod vystupu na base64
  return encrypted.toString(CryptoJS.enc.Base64);
}

// funkce pro desifrovani textu
function decryptText(encryptedText, key) {
  // desifrovani base64 vstupu na pole bytu
  const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedText);
  // ziskani IV z prvnich 16 bitu vstupu
  //const iv = encryptedBytes.slice(0, 16);
  //const iv = encryptedBytes.subarray(0, 16);
  const iv = encryptedBytes.clone();
  iv.sigBytes = 16;
  // ziskani zbyleho sifrovaneho textu
  //const ciphertext = encryptedBytes.slice(16);
  //const ciphertext = encryptedBytes.subarray(16);
  const ciphertext = encryptedBytes.clone();
  ciphertext.words.splice(0, 4);  // odebere slova IV
  // vytvoreni objektu pro desifrovani
  const cipherParams = {
    ciphertext: ciphertext,
    iv: iv,
    //key: key,
    key: CryptoJS.enc.Utf8.parse(key),  // konverze klice na format UTF-8
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  };
  // desifrovani textu
  //const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
  const decrypted = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Utf8.parse(key), {
    keySize: 256 / 32
  });
  // prevod desifrovaneho textu na puvodni UTF-8 retezec
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// ovladaci udalost pro tlacitko "Zasifrovat"
encryptButton.addEventListener('click', () => {
  const message = messageInput.value;
  const encryptionKey = encryptionKeyInput.value;
  const encrypted = encryptText(message, encryptionKey);
  encryptedTextOutput.textContent = 'Zašifrovaný text: ' + encrypted;
});

// ovladaci udalost pro tlacitko "Desifrovat"
decryptButton.addEventListener('click', () => {
  const encryptedText = encryptedTextOutput.textContent.split(': ')[1];
  const encryptionKey = encryptionKeyInput.value;
  const decrypted = decryptText(encryptedText, encryptionKey);
  decryptedTextOutput.textContent = 'Dešifrovaný text: ' + decrypted;
});

/*
// Priklad pouziti
const plaintext = 'Toto je tajná zpráva!';
//const encryptionKey = 'SuperTajnyKlic256bit';
const encryptionKey = 'MujNejSkvelySuperTajnyKlic256bit';

// Sifrovani
const encrypted = encryptText(plaintext, encryptionKey);
console.log('Zašifrovaný text:', encrypted);

// Desifrovani
const decrypted = decryptText(encrypted, encryptionKey);
console.log('Dešifrovaný text:', decrypted);
*/