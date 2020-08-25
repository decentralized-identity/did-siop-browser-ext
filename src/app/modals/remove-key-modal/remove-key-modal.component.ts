import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BackgroundMessageService } from 'src/app/background-message.service';
import { IdentityService } from 'src/app/identity.service';
import { TASKS } from 'src/const';

@Component({
  selector: 'remove-key-modal',
  templateUrl: './remove-key-modal.component.html',
  styleUrls: ['./remove-key-modal.component.scss', '../modals.common.scss']
})
export class RemoveKeyModalComponent implements OnInit {

  @ViewChild('modalInfo') modalInfo: ElementRef;
  @ViewChild('modalClose') modalClose: ElementRef;
  @ViewChild('modalYes') modalYes: ElementRef;
  @ViewChild('modalOpen') modelOpen: ElementRef;
  @ViewChild('kidToRemove') kidToRemove: ElementRef;

  @Output('didChanged') didChanged = new EventEmitter<boolean>();

  selectedKeyId: string;

  constructor(private toastrService: ToastrService, private messageService: BackgroundMessageService, private identityService: IdentityService) { }

  ngOnInit(): void {
  }

  open(kid){
    this.selectedKeyId = kid;
    this.kidToRemove.nativeElement.value = kid;
    this.modelOpen.nativeElement.click();
  }

  async removeKey(){
    this.modalInfo.nativeElement.classList.remove('error');
    this.modalInfo.nativeElement.classList.add('waiting');
    this.modalInfo.nativeElement.innerText = 'Please wait';
    this.modalClose.nativeElement.disabled = true;
    this.modalYes.nativeElement.disabled = true;

    this.messageService.sendMessage({
      task: TASKS.REMOVE_KEY,
      kid: this.selectedKeyId,
      }, 
      (response) =>{
        if(response.result){
          let newSigningInfoSet = this.identityService.getSigningInfoSet().filter(key => {
            return key.kid !== this.selectedKeyId;
          });
          this.identityService.setSigningInfoSet(newSigningInfoSet);
          this.toastrService.success(response.result, 'DID_SIOP', {
            onActivateTick: true,
            positionClass: 'toast-bottom-center',
          });
          this.modalClose.nativeElement.disabled = false;
          this.modalYes.nativeElement.disabled = false;
          this.clear();
          this.modalClose.nativeElement.click();
          this.didChanged.emit(true);
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

}
