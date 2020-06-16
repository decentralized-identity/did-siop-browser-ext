import { Injectable } from '@angular/core';
/// <reference types="chrome"/>
/// <reference types="firefox-webext-browser"/>

@Injectable({
  providedIn: 'root'
})
export class BackgroundMessageService {
  private runtime: any;

  constructor() {
    try{
      this.runtime = browser.runtime;
    }
    catch(err){
      try{
          this.runtime = chrome.runtime;
      }
      catch(err){
          console.log('DID-SIOP ERROR: No runtime detected');
      }
    }
  }

  sendMessage(message, callback){
    this.runtime.sendMessage(message, callback);
  }
}
