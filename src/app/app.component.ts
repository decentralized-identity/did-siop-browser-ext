import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  displayLogin: boolean = true;
  displayMain: boolean = false;

  constructor(private changeDetector: ChangeDetectorRef){}

  showLogin(){
    this.displayMain = false;
    this.displayLogin = true;
    this.changeDetector.detectChanges();
  }

  showMain(){
    this.displayLogin = false;
    this.displayMain = true;
    this.changeDetector.detectChanges();
  }
}
