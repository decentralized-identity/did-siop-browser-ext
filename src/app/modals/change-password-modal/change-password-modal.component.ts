import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BackgroundMessageService } from 'src/app/background-message.service';
import { IdentityService } from 'src/app/identity.service';
import { TASKS } from 'src/const';

@Component({
  selector: 'change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss', '../modals.common.scss']
})
export class ChangePasswordModalComponent implements OnInit {

  @ViewChild('modalClose') modalClose: ElementRef;
  @ViewChild('modalYes') modalYes: ElementRef;
  @ViewChild('modalInfo') modalInfo: ElementRef;
  @ViewChild('modalOpen') modalOpen: ElementRef;
  @ViewChild('oldPassword') oldPassword: ElementRef;
  @ViewChild('newPassword') newPassword: ElementRef;
  @ViewChild('newPassword2') newPassword2: ElementRef;
  
  @Output() didChanged = new EventEmitter<boolean>();
  
  constructor(private toastrService: ToastrService, private messageService: BackgroundMessageService) { }

  ngOnInit(): void {
  }

  open(){
    this.modalInfo.nativeElement.innerText = '';
    this.newPassword.nativeElement.value = '';
    this.newPassword2.nativeElement.value = '';
    this.oldPassword.nativeElement.value = '';
    this.modalOpen.nativeElement.click();
  }

  async changePassword(oldPassword: string, newPassword: string, newPassword2: string){
    this.modalInfo.nativeElement.classList.remove('error');
    this.modalInfo.nativeElement.classList.add('waiting');
    this.modalInfo.nativeElement.innerText = 'Please wait';
    this.modalClose.nativeElement.disabled = true;
    this.modalYes.nativeElement.disabled = true;

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
                  this.modalClose.nativeElement.disabled = false;
                  this.modalYes.nativeElement.disabled = false;
                  this.didChanged.emit(true);
                  this.modalClose.nativeElement.click();
                  this.toastrService.success('Password changed successfully', 'DID_SIOP', {
                    onActivateTick: true,
                    positionClass: 'toast-bottom-center',
                  });
                }
                else if(response.err){
                  this.modalClose.nativeElement.disabled = false;
                  this.modalYes.nativeElement.disabled = false;
                  this.modalInfo.nativeElement.classList.remove('waiting');
                  this.modalInfo.nativeElement.classList.add('error');
                  this.modalInfo.nativeElement.innerText = 'An error occurred';
                }
              }
             );
            }
            else{
              this.modalClose.nativeElement.disabled = false;
              this.modalYes.nativeElement.disabled = false;
              this.modalInfo.nativeElement.classList.remove('waiting');
              this.modalInfo.nativeElement.classList.add('error');
              this.modalInfo.nativeElement.innerText = 'Incorrect old password';
            }
          }
        );
      }
      else{
        this.modalClose.nativeElement.disabled = false;
        this.modalYes.nativeElement.disabled = false;
        this.modalInfo.nativeElement.classList.remove('waiting');
        this.modalInfo.nativeElement.classList.add('error');
        this.modalInfo.nativeElement.innerText = 'Passwords do not match';
      }
    }
    else{
      this.modalClose.nativeElement.disabled = false;
      this.modalYes.nativeElement.disabled = false;
      this.modalInfo.nativeElement.classList.remove('waiting');
      this.modalInfo.nativeElement.classList.add('error');
      this.modalInfo.nativeElement.innerText = 'Please fill all data';
    }
  }
}
