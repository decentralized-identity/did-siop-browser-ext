import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BackgroundMessageService } from '../background-message.service';
import { TASKS } from '../../globals'; 

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  currentDID: string;
  signingInfoSet: any[] = [];
  
  @ViewChild('newDID') newDID: ElementRef;
  @ViewChild('changeDIDModalClose') changeDIDModalClose: ElementRef;
  @ViewChild('changeDIDModalInfo') changeDIDModalInfo: ElementRef;

  @ViewChild('addNewKeyModalClose') addNewKeyModalClose: ElementRef;
  @ViewChild('addNewKeyModalInfo') addNewKeyModalInfo: ElementRef;
  @ViewChild('newKeyString') newKeyString: ElementRef;
  @ViewChild('newKeyKID') newKeyKID: ElementRef;

  @ViewChild('newPasswordModalClose') newPasswordModalClose: ElementRef;
  @ViewChild('newPasswordModalInfo') newPasswordModalInfo: ElementRef;
  @ViewChild('oldPassword') oldPassword: ElementRef;
  @ViewChild('newPassword') newPassword: ElementRef;
  @ViewChild('newPassword2') newPassword2: ElementRef;
  
  @ViewChild('removeKeyModalInfo') removeKeyModalInfo: ElementRef;
  @ViewChild('removeKeyModalClose') removeKeyModalClose: ElementRef;
  @ViewChild('toRemoveKeyKID') toRemoveKeyKID: ElementRef;

  @ViewChild('testDataModalClose') testDataModalClose: ElementRef;

  @Output() clickedBack = new EventEmitter<boolean>();

  constructor(private changeDetector: ChangeDetectorRef, private toastrService: ToastrService, private messageService: BackgroundMessageService) {
    this.messageService.sendMessage(
      {
        task: TASKS.GET_IDENTITY
      }
      ,
      (response) => {
        if(response.did){
          this.currentDID = response.did;
          this.signingInfoSet = JSON.parse(response.keys);
        }
        else{
          this.currentDID = 'No DID provided';
        }
        this.changeDetector.detectChanges();
      }
    )
  }

  ngOnInit(): void {
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

  selectKey(keyid){
    this.toRemoveKeyKID.nativeElement.value = keyid;
  }

  async changePassword(oldPassword: string, newPassword: string, newPassword2: string){
    this.newPasswordModalInfo.nativeElement.innerText = '';
    if(oldPassword.length != 0 && newPassword.length != 0 && newPassword2.length != 0){
      if(newPassword === newPassword2){
        this.messageService.sendMessage({
            task: TASKS.LOGIN,
            password: oldPassword
          }, 
          (response)=> {
            if(response.result){
             this.messageService.sendMessage({
               task: TASKS.CHANGE_EXT_AUTHENTICATION,
               oldPassword: oldPassword,
               newPassword: newPassword,
             },
              (response)=> {
                if(response.result){
                  this.oldPassword.nativeElement.value = '';
                  this.newPassword.nativeElement.value = '';
                  this.newPassword2.nativeElement.value = '';
                  this.newPasswordModalClose.nativeElement.click();
                  this.changeDetector.detectChanges();
                  this.toastrService.success('Password changed successfully', 'DID_SIOP', {
                    onActivateTick: true,
                    positionClass: 'toast-bottom-center',
                  });
                }
                else{
                  this.newPasswordModalInfo.nativeElement.innerText = 'An error occurred';
                }
              }
             );
            }
            else{
              this.newPasswordModalInfo.nativeElement.innerText = 'Incorrect old password';
              this.changeDetector.detectChanges();
            }
          }
        );
      }
      else{
        this.newPasswordModalInfo.nativeElement.innerText = 'Passwords do not match';
      }
    }
    else{
      this.newPasswordModalInfo.nativeElement.innerText = 'Please fill all data';
      console.log('error');
    }
  }

  async initializeTestData(){
    let did = 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83';
    if(did){
      this.messageService.sendMessage({
        task: TASKS.CHANGE_DID,
        did: did,
        }, 
        (response) =>{
          if(response.result){
            this.currentDID = did;
            let keyInfo = {
              alg: 'ES256K-R',
              kid: 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83#owner',
              key: 'CE438802C1F0B6F12BC6E686F372D7D495BC5AA634134B4A7EA4603CB25F0964',
              format: 'HEX',
            }
        
            this.messageService.sendMessage({
              task: TASKS.ADD_KEY,
              keyInfo: keyInfo,
              }, 
              (response) =>{
                if(response.result){
                  this.signingInfoSet.push(keyInfo);
                  this.testDataModalClose.nativeElement.click();
                  this.changeDetector.detectChanges();
                  this.toastrService.success('Successful', 'DID_SIOP', {
                    onActivateTick: true,
                    positionClass: 'toast-bottom-center',
                  });
                }
              }
            );
          }
        }
      );
    }
    else{
      this.changeDIDModalInfo.nativeElement.innerText = 'Please enter a valid DID';
    }
  }

  goBack(){
    this.clickedBack.emit(true);
  }

}
