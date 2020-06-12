import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { STORAGE_KEYS, TASKS } from 'src/globals';
import { BackgroundMessageService } from '../background-message.service';
/// <reference types="chrome"/>
/// <reference types="firefox-webext-browser"/>

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

  @ViewChild('newDID') newDID: ElementRef;
  @ViewChild('changeDIDModalClose') changeDIDModalClose: ElementRef;
  @ViewChild('changeDIDModalInfo') changeDIDModalInfo: ElementRef;

  @ViewChild('addNewKeyModalClose') addNewKeyModalClose: ElementRef;
  @ViewChild('addNewKeyModalInfo') addNewKeyModalInfo: ElementRef;
  @ViewChild('newKeyString') newKeyString: ElementRef;
  @ViewChild('newKeyKID') newKeyKID: ElementRef;
  
  @ViewChild('removeKeyModalInfo') removeKeyModalInfo: ElementRef;
  @ViewChild('removeKeyModalClose') removeKeyModalClose: ElementRef;

  constructor(private changeDetector: ChangeDetectorRef, private toastrService: ToastrService, private messageService: BackgroundMessageService) {
    

    let did = localStorage.getItem(STORAGE_KEYS.userDID);
    let signingInfoSet = JSON.parse(localStorage.getItem(STORAGE_KEYS.signingInfoSet));
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
      this.messageService.sendMessage({
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

    this.messageService.sendMessage({
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
      this.messageService.sendMessage({
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
