import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BackgroundMessageService } from '../background-message.service';
import { TASKS } from 'src/const'; 
import { IdentityService } from '../identity.service';
import { RemoveKeyModalComponent, ChangeDIDModalComponent, TestDataModalComponent, CreateDIDModalComponent, NewKeyModalComponent } from '../modals/modals.module';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  currentDID: string;
  signingInfoSet: any[] = [];
  
  @ViewChild('newKeyButton') newKeyButton: ElementRef;

  @ViewChild('removeKeyModal') removeKeyModal: RemoveKeyModalComponent;
  @ViewChild('changeDIDModal') changeDIDModal: ChangeDIDModalComponent;
  @ViewChild('testDataModal') testDataModal: TestDataModalComponent;
  @ViewChild('createDIDModal') createDIDModal: CreateDIDModalComponent;
  @ViewChild('newKeyModal') newKeyModal: NewKeyModalComponent;
  @ViewChild('changePasswordModal') changePasswordModal: ChangeDIDModalComponent;
  
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
          this.identityService.setCurrentDID(this.currentDID);
          this.identityService.setSigningInfoSet(this.signingInfoSet);
        }
        else{
          this.currentDID = 'No DID provided';
          this.newKeyButton.nativeElement.disabled = true;
        }
        this.changeDetector.detectChanges();
      }
    )
  }

  ngOnInit(): void {
  }

  didChange(changed: boolean){
    if(changed){
      this.newKeyButton.nativeElement.disabled = false;
      this.currentDID = this.identityService.getCurrentDID();
      this.signingInfoSet = this.identityService.getSigningInfoSet();
      this.changeDetector.detectChanges();
    }
  }

  openChangeDIDModal(){
    this.changeDIDModal.open();
  }

  openTestDataModal(){
    this.testDataModal.open();
  }

  openCreateDIDModal(){
    this.createDIDModal.open();
  }

  openNewKeyModal(){
    this.newKeyModal.open();
  }

  openRemoveKeyModal(kid){
    this.removeKeyModal.open(kid);
  }

  openChangePasswordModal(){
    this.changePasswordModal.open();
  }

  goBack(){
    this.clickedBack.emit(true);
  }
}
