import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
/// <reference types="chrome"/>
/// <reference types="firefox-webext-browser"/>

enum TASKS{
  CHANGE_DID,
  ADD_KEY,
  REMOVE_KEY,
  PROCESS_REQUEST,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'did-siop-ext';
  currentDID: string;
  signingInfoSet: any[] = [];
  env: any;

  @ViewChild('addNewKeyModalClose') addNewModalClose: ElementRef;
  @ViewChild('newKeyString') newKeyString: ElementRef;
  @ViewChild('newKeyKID') newKeyKID: ElementRef;

  constructor(private changeDetector: ChangeDetectorRef){
    if(chrome){
      this.env = chrome;
    }
    else if(browser){
        this.env = browser;
    }
    else{
        console.log('DID-SIOP ERROR: No runtime detected');
    }
    let did = localStorage.getItem('did_siop_user_did');
    let signingInfoSet = JSON.parse(localStorage.getItem('did_siop_singing_info_set'));
    if(did){
      this.currentDID = did;
      this.signingInfoSet = signingInfoSet;
    }
    else{
      this.currentDID = 'No DID provided';
    }
  }

  async changeDID(){
    let did = prompt('Enter new DID');
    if(did){
      env.runtime.sendMessage({
        task: TASKS.CHANGE_DID,
        did: did,
        }, 
        (response) =>{
          if(response.result){
            alert(response.result);
            this.currentDID = did;
            this.signingInfoSet = [];
            this.changeDetector.detectChanges();
          }
          else{
            alert(response.err);
          }
        }
      );
    }
  }

  addNewKey(keyString: string, kid: string, format: string, algorithm: string){
    let keyInfo = {
      alg: algorithm,
      kid: kid,
      key: keyString,
      format: format,
    }

    env.runtime.sendMessage({
      task: TASKS.ADD_KEY,
      keyInfo: keyInfo,
      }, 
      (response) =>{
        if(response.result){
          alert(response.result);
          this.signingInfoSet.push(keyInfo);
          this.addNewModalClose.nativeElement.click();
          this.newKeyString.nativeElement.value = '';
          this.newKeyKID.nativeElement.value = '';
          this.changeDetector.detectChanges();
        }
        else{
          alert(response.err);
        }
      }
    );
  }

  removeKey(kid: string){
    if(confirm('You are about to remove a key. Are you sure?')){
      env.runtime.sendMessage({
        task: TASKS.REMOVE_KEY,
        kid: kid,
        }, 
        (response) =>{
          if(response.result){
            alert(response.result);
            this.signingInfoSet = this.signingInfoSet.filter(key => {
              return key.kid !== kid;
            });
            this.changeDetector.detectChanges();
          }
          else{
            alert(response.err);
          }
        }
      );
    }
  }
}
