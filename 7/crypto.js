const crypto = require('crypto');
const fs = require('fs');

const startTime = Date.now();

// MD5 加密
// 耗时 1 ms 左右
// const hash = crypto.createHash('sha512');
// hash.update('Hello World');
// hash.update('Hello Jack');
// hash.digest('hex');


// Hmac 算法
// Hmac 算法也 是一种哈希算法，它可以利用 MD5 或 SHA1 等哈希算法。不同的是，Hmac 还需要一个密钥
// 只要密钥发生了变化，那么同样的输入数据也会得到不同的签名，因此，可以把 Hmac 理解为用随机数“增强”的哈希算法。
// 耗时 1 ms 左右
// const hmac = crypto.createHmac('sha256', 'secret-key');
// hmac.update('Hello, world');
// const str = hmac.digest('hex');
// console.log(str);

// AES
// AES 是一种常用的对称加密算法，加解密都用同一个密钥。crypto 模块提供了 AES 支持，但是需要自己封装好函数，便于使用：
// AES 支持的算法有 aes192、aes-128-ecb、aes-256-cbc
// 耗时 5 ms 左右
// function aesEncrypt(data, key) {
//   const cipher = crypto.createCipher('aes192', key);
//   let crypted = cipher.update(data, 'utf8', 'hex');
//   crypted += cipher.final('hex');
//   return crypted;
// }

// function aesDecrypt(encrypted, key) {
//   const decipher = crypto.createDecipher('aes192', key);
//   let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }

// const data = JSON.stringify({ a: 1, b: 2, c: 3 });
// const key = 'password!';
// const encrypted = aesEncrypt(data, key);
// const decrypted = aesDecrypt(encrypted, key);

// console.log('Plain text: ' + data);
// console.log('Encrypted text: ' + encrypted);
// console.log('Decrypted text: ' + decrypted);

// Diffie-Hellman
// DH 算法是一种密钥交换协议，它可以在双方不泄露密钥的情况下协商出一个密钥来。
// 耗时 200ms~1000ms 左右，应该用于一次生成后多次使用

// jack's keys:
// const jack = crypto.createDiffieHellman(512);
// const jack_keys = jack.generateKeys();

// const prime = jack.getPrime();
// const generator = jack.getGenerator();

// console.log(`Prime: ${prime.toString('hex')}`);
// console.log(`Generator: ${generator.toString('hex')}`);

// // rose's keys
// const rose = crypto.createDiffieHellman(prime, generator);
// const rose_keys = rose.generateKeys();

// // exchange and generate secret:
// const jack_secret = jack.computeSecret(rose_keys);
// const rose_secret = rose.computeSecret(jack_keys);

// // print secret:
// console.log(`Secret of Jack: ${jack_secret.toString('hex')}`);;
// console.log(`Secret of Rose: ${rose_secret.toString('hex')}`);;


// RSA
// RSA 算法是一种非对称加密算法，即由一个私钥和一个公钥构成的密钥对，通过私钥加密，公钥解密，或者通过公钥解密，私钥解密。其中，公钥可以公开，私钥必须保密。
// 使用公钥加密，使用私钥解密就是非对称加密。相比对称加密，非对称加密只需要每个人各自持有自己的私钥，同时公开自己的公钥，不需要向 AES 那样由两个人共享同一个密钥。
// 执行以下命令以生产一个 rsa 密钥对
// openssl genrsa -aes256 -out rsa-key.pem 2048
// 第二步，通过上面的rsa-key.pem加密文件，我们可以导出原始的私钥，命令如下：
// openssl rsa -in rsa-key.pem -outform PEM -out rsa-prv.pem
// 输入第一步的密码，我们获得了解密后的私钥。 类似的，我们用下面的命令导出原始的公钥
// openssl rsa -in rsa-key.pem -outform PEM -pubout -out rsa-pub.pem

// 从文件加载key:
function loadKey(file) {
  // key实际上就是PEM编码的字符串:
  return fs.readFileSync(file, 'utf8');
}

let
  prvKey = loadKey('./rsa-prv.pem'),
  pubKey = loadKey('./rsa-pub.pem');

function encryptByPub(message) {
  const enc_by_pub = crypto.publicEncrypt(pubKey, Buffer.from(message, 'utf8'));
  return enc_by_pub;
}

function decryptByPrv(enc_by_pub) {
  const dec_by_prv = crypto.privateDecrypt(prvKey, enc_by_pub);
  return dec_by_prv;
}

const enc_by_pub = encryptByPub('{ a: 1, b: 2, c: 3 }');
const dec_by_prv = decryptByPrv(enc_by_pub);

console.log(`encrypted message: ${enc_by_pub}`);
console.log(`decrypted message: ${dec_by_prv}`)

console.log(`Time cost: ${Date.now() - startTime}ms`)