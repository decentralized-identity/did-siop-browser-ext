import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BackgroundMessageService } from 'src/app/background-message.service';
import { IdentityService } from 'src/app/identity.service';
import { TASKS } from 'src/const';

@Component({
  selector: 'create-did-modal',
  templateUrl: './create-did-modal.component.html',
  styleUrls: ['./create-did-modal.component.scss', '../modals.common.scss']
})
export class CreateDIDModalComponent implements OnInit {
  
  @ViewChild('modalInfo') modalInfo: ElementRef;
  @ViewChild('modalClose') modalClose: ElementRef;
  
  @Output() didChanged = new EventEmitter<boolean>();

  constructor(private toastrService: ToastrService, private messageService: BackgroundMessageService, private identityService: IdentityService) { }

  ngOnInit(): void {
  }

  clearModal(){
    this.modalInfo.nativeElement.innerText = '';
  }

  async createNewDID(method: string, data: any){
    this.modalInfo.nativeElement.classList.remove('error');
    this.modalInfo.nativeElement.classList.add('waiting');
    this.modalInfo.nativeElement.innerText = 'Please wait';
    this.modalClose.nativeElement.disabled = true;

    if(method){
      this.messageService.sendMessage({
        task: TASKS.CREATE_DID,
        method,
        data
      },
      (response)=>{
        if(response.result){
          this.identityService.setCurrentDID(response.result.did);
          this.identityService.setSigningInfoSet([{kid: response.result.kid}]);
          this.modalClose.nativeElement.disabled = false;
          this.didChanged.emit(true);
          this.modalClose.nativeElement.click();
          this.clearModal();
          this.toastrService.success('Successful', 'DID_SIOP', {
            onActivateTick: true,
            positionClass: 'toast-bottom-center',
          });
        }
        else if(response.err){
          this.modalInfo.nativeElement.innerText = response.err;
          this.modalInfo.nativeElement.classList.remove('waiting');
          this.modalInfo.nativeElement.classList.add('error');
          this.modalClose.nativeElement.disabled = false;
        }
      }
      );
    }
  }
}
