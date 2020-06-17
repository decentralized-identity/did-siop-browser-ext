import { Component, ChangeDetectorRef, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TASKS } from 'src/globals';
import { BackgroundMessageService } from '../background-message.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  title = 'did-siop-ext';
  currentDID: string;
  currentRequests: any[];

  selectedRequest: any;
  selectedRequestClientID: string;

  @ViewChild('requestModalClose') requestModalClose: ElementRef;
  @ViewChild('requestModalInfo') requestModalInfo: ElementRef;
  @ViewChild('requestModalYes') requestModalYes: ElementRef;
  @ViewChild('requestModalNo') requestModalNo: ElementRef;

  @Output() loggedOut = new EventEmitter<boolean>();

  displayMainContent: boolean = true;
  displaySettings: boolean = false;
  displayGuides: boolean = false;

  constructor(private changeDetector: ChangeDetectorRef, private toastrService: ToastrService, private messageService: BackgroundMessageService) {
    this.loadIdentity();
    this.loadRequests();
  }

  
  logout(){
    this.messageService.sendMessage({
      task: TASKS.LOGOUT
    },
      (response)=>{
        if(response.result){
          this.loggedOut.emit(true);
        }
      }
    );
  }

  showMainContent(){
    this.displayMainContent = true;
    this.displayGuides = false;
    this.displaySettings = false;
    this.loadIdentity();
    this.changeDetector.detectChanges();
  }

  showGuides(){
    this.displayGuides = true;
    this.displayMainContent = false;
    this.displaySettings = false;
    this.changeDetector.detectChanges();
  }

  showSettings(){
    this.displaySettings = true;
    this.displayGuides = false;
    this.displayMainContent = false;
    this.changeDetector.detectChanges();
  }

  selectRequest(request:any){
    this.requestModalInfo.nativeElement.innerHTML = '';
    this.requestModalInfo.nativeElement.classList.remove('error');
    this.requestModalInfo.nativeElement.classList.remove('waiting');

    
    this.requestModalYes.nativeElement.disabled = false;
    this.requestModalNo.nativeElement.disabled = false;
    this.requestModalClose.nativeElement.disabled = false;

    this.selectedRequest = request;
    this.selectedRequestClientID = this.selectedRequest.client_id;
    this.changeDetector.detectChanges();
  }

  processRequest(confirmation: boolean){
    this.requestModalYes.nativeElement.disabled = true;
    this.requestModalNo.nativeElement.disabled = true;
    this.requestModalClose.nativeElement.disabled = true;
    this.requestModalInfo.nativeElement.classList.add('waiting');
    this.requestModalInfo.nativeElement.innerHTML = 'Processing request. Please wait';

    this.messageService.sendMessage({
      task: TASKS.PROCESS_REQUEST,
      did_siop_index: this.selectedRequest.index,
      confirmation: confirmation,
    },
      (response)=>{
        if(response.result){
            this.loadRequests();
            this.requestModalClose.nativeElement.click();
        }
        if(response.err){
            this.requestModalInfo.nativeElement.innerHTML = response.err;
            this.requestModalInfo.nativeElement.classList.add('error');
        }
      }
    );
  }

  private loadIdentity(){
    this.messageService.sendMessage(
      {
        task: TASKS.GET_IDENTITY
      }
      ,
      (response) => {
        if(response.did){
          this.currentDID = response.did;
        }
        else{
          this.currentDID = 'No DID provided';
        }
        this.changeDetector.detectChanges();
      }
    )
  }

  private loadRequests(){
    this.messageService.sendMessage(
      {
        task: TASKS.GET_REQUESTS
      }
      ,
      (response) => {
        if(response.didSiopRequests){
          this.currentRequests = response.didSiopRequests;
        }
        else{
          this.currentRequests = [];
        }
        this.changeDetector.detectChanges();
      }
    )
  }

}
