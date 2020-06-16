import { createHash, createCipher, createDecipher } from 'crypto-browserify';

export function hash(value: string, salt: string): string{
    let sha256 = createHash('sha256');
    let level1 = sha256.update(value).digest('hex');
    let salted = level1 + salt;
    let level2 = sha256.update(salted).digest('hex');
    let result = sha256.update(level2).digest('hex');
    return result;
  }

export function encrypt(value: string, password: string): string{
    const cipher = createCipher('aes-128-cbc', password);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decrypt(value: string, password: string){
    const decipher = createDecipher('aes-128-cbc', password);
    let decrypted = decipher.update(value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}