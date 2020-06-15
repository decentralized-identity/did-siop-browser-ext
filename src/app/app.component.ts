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
    this.displayLogin = true;
    this.displayMain = false;
    this.changeDetector.detectChanges();
  }

  showMain(){
    this.displayLogin = false;
    this.displayMain = true;
    this.changeDetector.detectChanges();
  }
}
