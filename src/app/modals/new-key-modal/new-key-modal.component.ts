import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BackgroundMessageService } from 'src/app/background-message.service';
import { IdentityService } from 'src/app/identity.service';
import { TASKS } from 'src/const';

@Component({
  selector: 'new-key-modal',
  templateUrl: './new-key-modal.component.html',
  styleUrls: ['./new-key-modal.component.scss', '../modals.common.scss']
})
export class NewKeyModalComponent implements OnInit {

  @ViewChild('modalClose') modalClose: ElementRef;
  @ViewChild('modalYes') modalYes: ElementRef;
  @ViewChild('modalInfo') modalInfo: ElementRef;
  @ViewChild('newKeyString') newKeyString: ElementRef;

  @Output() didChanged = new EventEmitter<boolean>();

  constructor(private toastrService: ToastrService, private messageService: BackgroundMessageService, private identityService: IdentityService) { }

  ngOnInit(): void {
  }

  clearModal(){
    this.modalInfo.nativeElement.innerText = '';
    this.newKeyString.nativeElement.value = '';
  }

  async addNewKey(keyString: string){
    this.modalInfo.nativeElement.classList.remove('error');
    this.modalInfo.nativeElement.classList.add('waiting');
    this.modalInfo.nativeElement.innerText = 'Please wait';
    this.modalClose.nativeElement.disabled = true;
    this.modalYes.nativeElement.disabled = true;

    if(keyString){
      this.messageService.sendMessage({
        task: TASKS.ADD_KEY,
        keyInfo: keyString,
        }, 
        (response) =>{
          if(response.result){
            let currentSigningInfoSet = this.identityService.getSigningInfoSet();
            currentSigningInfoSet.push({kid: response.result});
            this.identityService.setSigningInfoSet(currentSigningInfoSet);
            this.modalInfo.nativeElement.classList.remove('waiting');
            this.modalClose.nativeElement.disabled = false;
            this.modalYes.nativeElement.disabled = false;
            this.clearModal();
            this.modalClose.nativeElement.click();
            this.didChanged.emit(true);
            this.toastrService.success(response.result, 'DID_SIOP', {
              onActivateTick: true,
              positionClass: 'toast-bottom-center',
            });
          }
          else if(response.err){
            this.modalInfo.nativeElement.classList.remove('waiting');
            this.modalInfo.nativeElement.classList.add('error');
            this.modalInfo.nativeElement.innerText = response.err;
            this.modalClose.nativeElement.disabled = false;
            this.modalYes.nativeElement.disabled = false;
          }
        }
      );
    }
    else{
      this.modalInfo.nativeElement.classList.remove('waiting');
      this.modalInfo.nativeElement.classList.add('error');
      this.modalInfo.nativeElement.innerText = 'Please fill all fields';
      this.modalClose.nativeElement.disabled = false;
      this.modalYes.nativeElement.disabled = false;
    }
  }

}
