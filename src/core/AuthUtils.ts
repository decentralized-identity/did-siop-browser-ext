import { STORAGE_KEYS } from '../const';
import { hash } from './CryptoUtils';

export function initExtAuthentication(password: string): boolean{
    try{
      let salt = randomString(32);
      let hashed = hash(password, salt);
      localStorage.setItem(STORAGE_KEYS.password, hashed);
      localStorage.setItem(STORAGE_KEYS.salt, salt);
      return true;
    }
    catch(err){
      return false;
    }
}

export function authenticate(password: string): boolean{
  let salt = localStorage.getItem(STORAGE_KEYS.salt);
  let hashed = hash(password, salt);
  let storedHash = localStorage.getItem(STORAGE_KEYS.password);
  return hashed === storedHash;
}

export function checkExtAuthenticationState(): boolean{
  if(localStorage.getItem(STORAGE_KEYS.password) != null){
    return true;
  }
  return false;
}

function randomString(length: number): string {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}