import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BackgroundMessageService } from 'src/app/background-message.service';
import { IdentityService } from 'src/app/identity.service';
import { TASKS } from 'src/const';

@Component({
  selector: 'test-data-modal',
  templateUrl: './test-data-modal.component.html',
  styleUrls: ['./test-data-modal.component.scss', '../modals.common.scss']
})
export class TestDataModalComponent implements OnInit {

  @ViewChild('modalClose') modalClose: ElementRef;
  @ViewChild('modalInfo') modalInfo: ElementRef;
  @ViewChild('modalYes') modalYes: ElementRef;

  @Output() didChanged = new EventEmitter<boolean>();

  constructor(private toastrService: ToastrService, private messageService: BackgroundMessageService, private identityService: IdentityService) { }

  ngOnInit(): void {
  }

  clearModal(){
    this.modalInfo.nativeElement.innerText = '';
  }

  async initializeTestData(){
    this.modalInfo.nativeElement.classList.remove('error');
    this.modalInfo.nativeElement.classList.add('waiting');
    this.modalInfo.nativeElement.innerText = 'Please wait';
    this.modalClose.nativeElement.disabled = true;
    this.modalYes.nativeElement.disabled = true;

    let did = 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83';
    if(did){
      this.messageService.sendMessage({
        task: TASKS.CHANGE_DID,
        did: did,
        }, 
        (response) =>{
          if(response.result){
            this.identityService.setCurrentDID(did);
            let keyString = 'CE438802C1F0B6F12BC6E686F372D7D495BC5AA634134B4A7EA4603CB25F0964';
        
            this.messageService.sendMessage({
              task: TASKS.ADD_KEY,
              keyInfo: keyString,
              }, 
              (response) =>{
                if(response.result){
                  this.identityService.setSigningInfoSet([{kid: response.result}]);
                  this.modalClose.nativeElement.disabled = false;
                  this.modalYes.nativeElement.disabled = false;
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
                  this.modalYes.nativeElement.disabled = false;
                }
              }
            );
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
      this.modalInfo.nativeElement.classList.remove('waiting');
      this.modalInfo.nativeElement.classList.add('error');
      this.modalClose.nativeElement.disabled = false;
      this.modalYes.nativeElement.disabled = false;
    }
  }

}
