const encryptButton = document.getElementById('encryptButton');
const decryptButton = document.getElementById('decryptButton');
const messageInput = document.getElementById('message');
const encryptionKeyInput = document.getElementById('encryptionKey');
const encryptedTextOutput = document.getElementById('encryptedText');
const decryptedTextOutput = document.getElementById('decryptedText');

//const encryptionKey = 'MujNejSkvelySuperTajnyKlic256bit';

/*
// funkce pro sifrovani textu
function encryptText(text, key) {
  // prevod textu na pole bytu
  const textBytes = CryptoJS.enc.Utf8.parse(text);
  // generovani nahodneho inicializacniho vektoru (IV)
  const iv = CryptoJS.lib.WordArray.random(16);
  // sifrovaci algoritmus AES s 256bit klicem a CBC rezimem
  //const cipherText = CryptoJS.AES.encrypt(textBytes, key, {
  const encrypted = CryptoJS.AES.encrypt(textBytes, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    keySize: 256 / 32,
    padding: CryptoJS.pad.Pkcs7
  });
  // kombinace IV a sifrovaneho textu do jednoho vystupu
  //const encrypted = iv.concat(cipherText.ciphertext);
  const ivAndCiphertext = iv.concat(encrypted.ciphertext);
  // prevod vystupu na base64
  //return encrypted.toString(CryptoJS.enc.Base64);
  return ivAndCiphertext.toString(CryptoJS.enc.Base64);
}

// funkce pro desifrovani textu
function decryptText(encryptedText, key) {
  // desifrovani base64 vstupu na pole bytu
  //const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedText);
  const ivAndCiphertext = CryptoJS.enc.Base64.parse(encryptedText);
  // ziskani IV z prvnich 16 bitu vstupu
  //const iv = encryptedBytes.slice(0, 16);
  //const iv = encryptedBytes.subarray(0, 16);
  //const iv = encryptedBytes.clone();
  const iv = ivAndCiphertext.clone();
  iv.sigBytes = 16;
  // ziskani zbyleho sifrovaneho textu
  //const ciphertext = encryptedBytes.slice(16);
  //const ciphertext = encryptedBytes.subarray(16);
  //const ciphertext = encryptedBytes.clone();
  const ciphertext = ivAndCiphertext.clone();
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
*/

// Funkce pro šifrování textu
function encryptText(text, key) {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });
  return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}

// Funkce pro dešifrování textu
function decryptText(encryptedText, key) {
  if (!encryptedText) {
    return "Chybí zašifrovaný text.";
  }

  const rawData = CryptoJS.enc.Base64.parse(encryptedText);

  const ivBuffer = new ArrayBuffer(16);
  const ivView = new DataView(ivBuffer);
  for (let i = 0; i < 4; i++) {
    ivView.setUint32(i * 4, rawData.words[i]);
  }

  const ciphertextBuffer = new ArrayBuffer(rawData.sigBytes - 16);
  const ciphertextView = new DataView(ciphertextBuffer);
  for (let i = 0; i < ciphertextBuffer.byteLength; i++) {
    ciphertextView.setUint8(i, rawData.words[i + 4]);
  }

  const iv = CryptoJS.lib.WordArray.create(ivBuffer);
  const ciphertext = CryptoJS.lib.WordArray.create(ciphertextBuffer);

  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: ciphertext
  });

  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv: iv });
  return decrypted.toString(CryptoJS.enc.Utf8);
}



// ovladaci udalost pro tlacitko "Zasifrovat"
encryptButton.addEventListener('click', () => {
  const message = messageInput.value;
  const encryptionKey = encryptionKeyInput.value;
  const encrypted = encryptText(message, encryptionKey);
  encryptedTextOutput.textContent = 'Zašifrovaný text: ' + encrypted;
  decryptedTextOutput.textContent = ''; // vynulovani vystupu pro desifrovany text
});

// ovladaci udalost pro tlacitko "Desifrovat"
decryptButton.addEventListener('click', () => {
  const message = messageInput.value;
  const encryptionKey = encryptionKeyInput.value;
  if (encryptButton.disabled) {
    // desifrovani
    const decrypted = decryptText(message, encryptionKey);
    decryptedTextOutput.textContent = 'Dešifrovaný text: ' + decrypted;
    encryptedTextOutput.textContent = ''; // vynulovani vystupu pro desifrovany text
  } else {
    // zasifrovani
    const encrypted = encryptText(message, encryptionKey);
    encryptedTextOutput.textContent = 'Zašifrovaný text: ' + encrypted;
    decryptedTextOutput.textContent = ''; // vynulovani vystupu pro desifrovany text
  }
});
