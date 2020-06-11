import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
/// <reference types="chrome"/>
/// <reference types="firefox-webext-browser"/>

enum TASKS{
  CHANGE_DID,
  ADD_KEY,
  REMOVE_KEY,
  PROCESS_REQUEST,
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  title = 'did-siop-ext';
  currentDID: string;
  signingInfoSet: any[] = [];
  selectedKeyID: string; 
  runtime: any;

  @ViewChild('newDID') newDID: ElementRef;
  @ViewChild('changeDIDModalClose') changeDIDModalClose: ElementRef;
  @ViewChild('changeDIDModalInfo') changeDIDModalInfo: ElementRef;

  @ViewChild('addNewKeyModalClose') addNewKeyModalClose: ElementRef;
  @ViewChild('addNewKeyModalInfo') addNewKeyModalInfo: ElementRef;
  @ViewChild('newKeyString') newKeyString: ElementRef;
  @ViewChild('newKeyKID') newKeyKID: ElementRef;
  
  @ViewChild('removeKeyModalInfo') removeKeyModalInfo: ElementRef;
  @ViewChild('removeKeyModalClose') removeKeyModalClose: ElementRef;

  constructor(private changeDetector: ChangeDetectorRef, private toastrService: ToastrService) {
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

  async changeDID(did: string){
    this.changeDIDModalInfo.nativeElement.innerText = '';
    if(did){
      this.runtime.sendMessage({
        task: TASKS.CHANGE_DID,
        did: did,
        }, 
        (response) =>{
          if(response.result){
            this.currentDID = did;
            this.signingInfoSet = [];
            this.newDID.nativeElement.value = '';
            this.changeDIDModalClose.nativeElement.click();
            this.changeDetector.detectChanges();
            this.toastrService.success(response.result, 'DID_SIOP', {
              onActivateTick: true,
              positionClass: 'toast-bottom-center',
            });
          }
          else{
            this.changeDIDModalInfo.nativeElement.innerText = response.err;
          }
        }
      );
    }
    else{
      this.changeDIDModalInfo.nativeElement.innerText = 'Please enter a valid DID';
    }
  }

  async addNewKey(keyString: string, kid: string, format: string, algorithm: string){
    this.addNewKeyModalInfo.nativeElement.innerText = '';
    let keyInfo = {
      alg: algorithm,
      kid: kid,
      key: keyString,
      format: format,
    }

    this.runtime.sendMessage({
      task: TASKS.ADD_KEY,
      keyInfo: keyInfo,
      }, 
      (response) =>{
        if(response.result){
          this.signingInfoSet.push(keyInfo);
          this.addNewKeyModalClose.nativeElement.click();
          this.newKeyString.nativeElement.value = '';
          this.newKeyKID.nativeElement.value = '';
          this.changeDetector.detectChanges();
          this.toastrService.success(response.result, 'DID_SIOP', {
            onActivateTick: true,
            positionClass: 'toast-bottom-center',
          });
        }
        else{
          this.addNewKeyModalInfo.nativeElement.innerText = response.err;
        }
      }
    );
  }

  async removeKey(kid: string){
    this.removeKeyModalInfo.nativeElement.innerText = '';
    if(kid){
      this.runtime.sendMessage({
        task: TASKS.REMOVE_KEY,
        kid: kid,
        }, 
        (response) =>{
          if(response.result){
            this.signingInfoSet = this.signingInfoSet.filter(key => {
              return key.kid !== kid;
            });
            this.toastrService.success(response.result, 'DID_SIOP', {
              onActivateTick: true,
              positionClass: 'toast-bottom-center',
            });
            this.removeKeyModalClose.nativeElement.click();
            this.changeDetector.detectChanges();
          }
          else{
            this.removeKeyModalInfo.nativeElement.innerText = response.err;
          }
        }
      );
    }
  }

}
