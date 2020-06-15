import { Component, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
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

  @Output() loggedOut = new EventEmitter<boolean>();

  displayMainContent: boolean = true;
  displaySettings: boolean = false;
  displayGuides: boolean = false;

  constructor(private changeDetector: ChangeDetectorRef, private toastrService: ToastrService, private messageService: BackgroundMessageService) {
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

}
