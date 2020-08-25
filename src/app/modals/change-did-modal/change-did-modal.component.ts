import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BackgroundMessageService } from 'src/app/background-message.service';
import { TASKS } from 'src/const';
import { IdentityService } from 'src/app/identity.service';

@Component({
  selector: 'change-did-modal',
  templateUrl: './change-did-modal.component.html',
  styleUrls: ['./change-did-modal.component.scss', '../modals.common.scss']
})
export class ChangeDIDModalComponent implements OnInit {

  @ViewChild('newDID') newDID: ElementRef;
  @ViewChild('modalClose') modalClose: ElementRef;
  @ViewChild('modalInfo') modalInfo: ElementRef;
  @ViewChild('modalYes') modalYes: ElementRef;
  @ViewChild('modalOpen') modelOpen: ElementRef;

  @Output() didChanged = new EventEmitter<boolean>();

  constructor(private toastrService: ToastrService, private messageService: BackgroundMessageService, private identityService: IdentityService) { }

  ngOnInit(): void {
  }

  open(){
    this.modalInfo.nativeElement.innerText = '';
    this.newDID.nativeElement.value = '';
    this.modelOpen.nativeElement.click();
  }

  async changeDID(did: string){
    this.modalInfo.nativeElement.classList.remove('error');
    this.modalInfo.nativeElement.classList.add('waiting');
    this.modalInfo.nativeElement.innerText = 'Please wait';
    this.modalClose.nativeElement.disabled = true;
    this.modalYes.nativeElement.disabled = true;
    if(did){
      this.messageService.sendMessage({
        task: TASKS.CHANGE_DID,
        did: did,
        }, 
        (response) =>{
          if(response.result){
            this.identityService.setCurrentDID(did);
            this.identityService.setSigningInfoSet([]);
            this.newDID.nativeElement.value = '';
            this.modalInfo.nativeElement.classList.remove('waiting');
            this.modalClose.nativeElement.disabled = false;
            this.modalYes.nativeElement.disabled = false;
            this.modalClose.nativeElement.click();
            this.didChanged.emit(true);
            this.toastrService.success(response.result, 'DID_SIOP', {
              onActivateTick: true,
              positionClass: 'toast-bottom-center',
            });
          }
          else if(response.err){
            this.modalInfo.nativeElement.innerText = response.err;
            this.modalInfo.nativeElement.classList.remove('waiting');
            this.modalInfo.nativeElement.classList.add('error');
            this.modalClose.nativeElement.disabled = false;
            this.modalYes.nativeElement.disabled = false;
          }
        }
      );
    }
    else{
      this.modalInfo.nativeElement.innerText = 'Please enter a valid DID';
      this.modalInfo.nativeElement.classList.remove('waiting');
      this.modalInfo.nativeElement.classList.add('error');
      this.modalClose.nativeElement.disabled = false;
      this.modalYes.nativeElement.disabled = false;
    }
  }

}
