import { createHash } from 'crypto-browserify';

export function hash(value: string, salt: string): string{
    let sha256 = createHash('sha256');
    let level1 = sha256.update(value).digest('hex');
    let salted = level1 + salt;
    let level2 = sha256.update(salted).digest('hex');
    let result = sha256.update(level2).digest('hex');
    return result;
  }

export function encode(value: string, key: string): string{
    return 'Not supported';
}