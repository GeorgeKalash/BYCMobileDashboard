import { SHA1 } from "crypto-js";

export const encryptePWD = (pwd) => {
  const encryptedPWD = SHA1(pwd).toString();
  let shuffledString = "";
  for (let i = 0; i < encryptedPWD.length; i += 8) {
    const sub = encryptedPWD.slice(i, i + 8);
    shuffledString += sub.charAt(6) + sub.charAt(7);
    shuffledString += sub.charAt(4) + sub.charAt(5);
    shuffledString += sub.charAt(2) + sub.charAt(3);
    shuffledString += sub.charAt(0) + sub.charAt(1);
  }
  return shuffledString.toUpperCase();
};
