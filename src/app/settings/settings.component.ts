import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BackgroundMessageService } from '../background-message.service';
import { TASKS } from 'src/const'; 
import { IdentityService } from '../identity.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  currentDID: string;
  signingInfoSet: any[] = [];
  
  @ViewChild('addNewKeyButton') addNewKeyButton: ElementRef;
  @ViewChild('addNewKeyModalClose') addNewKeyModalClose: ElementRef;
  @ViewChild('addNewKeyModalYes') addNewKeyModalYes: ElementRef;
  @ViewChild('addNewKeyModalInfo') addNewKeyModalInfo: ElementRef;
  @ViewChild('newKeyString') newKeyString: ElementRef;

  @ViewChild('newPasswordModalClose') newPasswordModalClose: ElementRef;
  @ViewChild('newPasswordModalYes') newPasswordModalYes: ElementRef;
  @ViewChild('newPasswordModalInfo') newPasswordModalInfo: ElementRef;
  @ViewChild('oldPassword') oldPassword: ElementRef;
  @ViewChild('newPassword') newPassword: ElementRef;
  @ViewChild('newPassword2') newPassword2: ElementRef;
  
  @ViewChild('removeKeyModalInfo') removeKeyModalInfo: ElementRef;
  @ViewChild('removeKeyModalClose') removeKeyModalClose: ElementRef;
  @ViewChild('removeKeyModalYes') removeKeyModalYes: ElementRef;
  @ViewChild('toRemoveKeyKID') toRemoveKeyKID: ElementRef;

  @ViewChild('createDIDModalInfo') createDIDModalInfo: ElementRef;
  @ViewChild('createDIDModalClose') createDIDModalClose: ElementRef;

  @Output() clickedBack = new EventEmitter<boolean>();

  constructor(private changeDetector: ChangeDetectorRef, private toastrService: ToastrService, private messageService: BackgroundMessageService, private identityService: IdentityService) {
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
          this.addNewKeyButton.nativeElement.disabled = true;
        }
        this.changeDetector.detectChanges();
      }
    )
  }

  ngOnInit(): void {
  }

  didChange(changed: boolean){
    if(changed){
      this.addNewKeyButton.nativeElement.disabled = false;
      this.currentDID = this.identityService.getCurrentDID();
      this.signingInfoSet = this.identityService.getSigningInfoSet();
      this.changeDetector.detectChanges();
    }
  }

  addNewKeyButtonClicked(){
    this.addNewKeyModalInfo.nativeElement.innerText = '';
    this.newKeyString.nativeElement.value = '';
  }

  async addNewKey(keyString: string){
    this.addNewKeyModalInfo.nativeElement.classList.remove('error');
    this.addNewKeyModalInfo.nativeElement.classList.add('waiting');
    this.addNewKeyModalInfo.nativeElement.innerText = 'Please wait';
    this.addNewKeyModalClose.nativeElement.disabled = true;
    this.addNewKeyModalYes.nativeElement.disabled = true;

    if(keyString){
      this.messageService.sendMessage({
        task: TASKS.ADD_KEY,
        keyInfo: keyString,
        }, 
        (response) =>{
          if(response.result){
            this.signingInfoSet.push({key: keyString, kid: response.result});
            this.addNewKeyModalInfo.nativeElement.classList.remove('waiting');
            this.addNewKeyModalClose.nativeElement.disabled = false;
            this.addNewKeyModalYes.nativeElement.disabled = false;
            this.addNewKeyModalClose.nativeElement.click();
            this.changeDetector.detectChanges();
            this.toastrService.success(response.result, 'DID_SIOP', {
              onActivateTick: true,
              positionClass: 'toast-bottom-center',
            });
          }
          else if(response.err){
            this.addNewKeyModalInfo.nativeElement.classList.remove('waiting');
            this.addNewKeyModalInfo.nativeElement.classList.add('error');
            this.addNewKeyModalInfo.nativeElement.innerText = response.err;
            this.addNewKeyModalClose.nativeElement.disabled = false;
            this.addNewKeyModalYes.nativeElement.disabled = false;
          }
        }
      );
    }
    else{
      this.addNewKeyModalInfo.nativeElement.classList.remove('waiting');
      this.addNewKeyModalInfo.nativeElement.classList.add('error');
      this.addNewKeyModalInfo.nativeElement.innerText = 'Please fill all fields';
      this.addNewKeyModalClose.nativeElement.disabled = false;
      this.addNewKeyModalYes.nativeElement.disabled = false;
    }
  }

  async removeKey(kid: string){
    this.removeKeyModalInfo.nativeElement.classList.remove('error');
    this.removeKeyModalInfo.nativeElement.classList.add('waiting');
    this.removeKeyModalInfo.nativeElement.innerText = 'Please wait';
    this.removeKeyModalClose.nativeElement.disabled = true;
    this.removeKeyModalYes.nativeElement.disabled = true;

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
            this.removeKeyModalClose.nativeElement.disabled = false;
            this.removeKeyModalYes.nativeElement.disabled = false;
            this.removeKeyModalClose.nativeElement.click();
            this.changeDetector.detectChanges();
          }
          else if(response.err){
            this.removeKeyModalInfo.nativeElement.innerText = response.err;
            this.removeKeyModalInfo.nativeElement.classList.remove('waiting');
            this.removeKeyModalInfo.nativeElement.classList.add('error');
            this.removeKeyModalClose.nativeElement.disabled = false;
            this.removeKeyModalYes.nativeElement.disabled = false;
          }
        }
      );
    }
  }

  selectKey(keyid){
    this.toRemoveKeyKID.nativeElement.value = keyid;
    this.removeKeyModalInfo.nativeElement.innerText = '';
  }

  changePasswordButtonClicked(){
    this.newPasswordModalInfo.nativeElement.innerText = '';
    this.newPassword.nativeElement.value = '';
    this.newPassword2.nativeElement.value = '';
    this.oldPassword.nativeElement.value = '';
  }

  async changePassword(oldPassword: string, newPassword: string, newPassword2: string){
    this.newPasswordModalInfo.nativeElement.classList.remove('error');
    this.newPasswordModalInfo.nativeElement.classList.add('waiting');
    this.newPasswordModalInfo.nativeElement.innerText = 'Please wait';
    this.newPasswordModalClose.nativeElement.disabled = true;
    this.newPasswordModalYes.nativeElement.disabled = true;

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
                  this.newPasswordModalClose.nativeElement.disabled = false;
                  this.newPasswordModalYes.nativeElement.disabled = false;
                  this.newPasswordModalClose.nativeElement.click();
                  this.changeDetector.detectChanges();
                  this.toastrService.success('Password changed successfully', 'DID_SIOP', {
                    onActivateTick: true,
                    positionClass: 'toast-bottom-center',
                  });
                }
                else if(response.err){
                  this.newPasswordModalClose.nativeElement.disabled = false;
                  this.newPasswordModalYes.nativeElement.disabled = false;
                  this.newPasswordModalInfo.nativeElement.classList.remove('waiting');
                  this.newPasswordModalInfo.nativeElement.classList.add('error');
                  this.newPasswordModalInfo.nativeElement.innerText = 'An error occurred';
                }
              }
             );
            }
            else{
              this.newPasswordModalClose.nativeElement.disabled = false;
              this.newPasswordModalYes.nativeElement.disabled = false;
              this.newPasswordModalInfo.nativeElement.classList.remove('waiting');
              this.newPasswordModalInfo.nativeElement.classList.add('error');
              this.newPasswordModalInfo.nativeElement.innerText = 'Incorrect old password';
            }
          }
        );
      }
      else{
        this.newPasswordModalClose.nativeElement.disabled = false;
        this.newPasswordModalYes.nativeElement.disabled = false;
        this.newPasswordModalInfo.nativeElement.classList.remove('waiting');
        this.newPasswordModalInfo.nativeElement.classList.add('error');
        this.newPasswordModalInfo.nativeElement.innerText = 'Passwords do not match';
      }
    }
    else{
      this.newPasswordModalClose.nativeElement.disabled = false;
      this.newPasswordModalYes.nativeElement.disabled = false;
      this.newPasswordModalInfo.nativeElement.classList.remove('waiting');
      this.newPasswordModalInfo.nativeElement.classList.add('error');
      this.newPasswordModalInfo.nativeElement.innerText = 'Please fill all data';
    }
  }

  async createNewDID(method: string, data: any){
    this.createDIDModalInfo.nativeElement.classList.remove('error');
    this.createDIDModalInfo.nativeElement.classList.add('waiting');
    this.createDIDModalInfo.nativeElement.innerText = 'Please wait';
    this.createDIDModalClose.nativeElement.disabled = true;

    if(method){
      this.messageService.sendMessage({
        task: TASKS.CREATE_DID,
        method,
        data
      },
      (response)=>{
        if(response.result){
          this.currentDID = response.result.did;

          this.signingInfoSet = [];
          this.signingInfoSet.push({key: response.result.keyString, kid: response.result.kid});
          this.createDIDModalClose.nativeElement.disabled = false;
          this.createDIDModalClose.nativeElement.click();
          this.changeDetector.detectChanges();
          this.toastrService.success('Successful', 'DID_SIOP', {
            onActivateTick: true,
            positionClass: 'toast-bottom-center',
          });
        }
        else if(response.err){
          this.createDIDModalInfo.nativeElement.innerText = response.err;
          this.createDIDModalInfo.nativeElement.classList.remove('waiting');
          this.createDIDModalInfo.nativeElement.classList.add('error');
          this.createDIDModalClose.nativeElement.disabled = false;
        }
      }
      );
    }
  }

  goBack(){
    this.clickedBack.emit(true);
  }
}
