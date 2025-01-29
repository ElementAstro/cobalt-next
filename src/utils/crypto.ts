// 新增加密工具函数
import CryptoJS from "crypto-js";

export const encryptFile = async (
  file: ArrayBuffer,
  password: string
): Promise<ArrayBuffer> => {
  // 将ArrayBuffer转为WordArray
  const wordArray = CryptoJS.lib.WordArray.create(file);

  // 使用密码加密
  const encrypted = CryptoJS.AES.encrypt(wordArray, password).toString();

  // 将加密后的字符串转回ArrayBuffer
  const encryptedArray = new TextEncoder().encode(encrypted);

  // 创建新的ArrayBuffer并复制数据
  const buffer = new ArrayBuffer(encryptedArray.byteLength);
  new Uint8Array(buffer).set(encryptedArray);
  return buffer;
};

export const decryptFile = async (
  encryptedFile: ArrayBuffer,
  password: string
): Promise<ArrayBuffer> => {
  // 将ArrayBuffer转为字符串
  const encryptedStr = new TextDecoder().decode(encryptedFile);

  try {
    // 解密
    const decrypted = CryptoJS.AES.decrypt(encryptedStr, password);

    // 转回ArrayBuffer
    const wordArray = decrypted.words;
    const ui8a = new Uint8Array(wordArray.length * 4);
    let b = 0;

    for (let i = 0; i < wordArray.length; i++) {
      const word = wordArray[i];
      ui8a[b++] = (word >> 24) & 0xff;
      ui8a[b++] = (word >> 16) & 0xff;
      ui8a[b++] = (word >> 8) & 0xff;
      ui8a[b++] = word & 0xff;
    }

    // 创建新的ArrayBuffer并复制数据
    const buffer = new ArrayBuffer(ui8a.byteLength);
    new Uint8Array(buffer).set(ui8a);
    return buffer;
  } catch (error) {
    throw new Error("解密失败,密码错误或文件已损坏");
  }
};
