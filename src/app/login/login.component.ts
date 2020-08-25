import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TASKS } from 'src/const';
import { BackgroundMessageService } from '../background-message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @Output() loggedIn = new EventEmitter<boolean>();

  loginState: boolean = false;
  extAuthenticationState:boolean = false;

  @ViewChild('password') password: ElementRef;
  @ViewChild('newPassword') newPassword: ElementRef;
  @ViewChild('confirmNewPassword') confirmNewPassword: ElementRef;

  constructor(private router: Router, private changeDetector: ChangeDetectorRef, private messageService: BackgroundMessageService) { }

  ngAfterViewInit(): void {
    this.messageService.sendMessage({
      task: TASKS.CHECK_EXT_AUTHENTICATION
    },
      (response)=>{
        if(response.result){
          this.extAuthenticationState = true;
          this.changeDetector.detectChanges();
          this.messageService.sendMessage({
            task: TASKS.CHECK_LOGIN_STATE
          },
            (response)=>{
              if(response.result){
                this.loggedIn.emit(true);
              }
            }
          )
        }
      }
    )
  }

  ngOnInit(): void {
  }

  login(password){
    if(password.length != 0){
      this.messageService.sendMessage({
        task: TASKS.LOGIN,
        password: password
      },
        (response)=>{
          if(response.result){
            this.loggedIn.emit(true);
          }
          else{
            this.password.nativeElement.value = '';
            this.password.nativeElement.classList.add('invalid-input');
            this.password.nativeElement.placeholder = 'Invalid password';
          }
        }
      );
    }
    else{
      this.password.nativeElement.placeholder = 'Please enter the password';
      this.password.nativeElement.classList.add('invalid-input');
    }
  }

  register(password1, password2){
    if(password1.length != 0){
      if(password2.length != 0){
        if(password1 == password2){
          this.messageService.sendMessage({
            task: TASKS.INIT_EXT_AUTHENTICATION,
            password: password1
          },
          (response)=>{
            if(response.result){
              this.extAuthenticationState = true;
              this.changeDetector.detectChanges();
            }
          }
          )
        }
        else{
          this.confirmNewPassword.nativeElement.value = '';
          this.confirmNewPassword.nativeElement.placeholder = 'Passwords do not match';
          this.confirmNewPassword.nativeElement.classList.add('invalid-input');
        }
      }
      else{
        this.confirmNewPassword.nativeElement.placeholder = 'Please confirm new password';
        this.confirmNewPassword.nativeElement.classList.add('invalid-input');
      }
    }
    else{
      this.newPassword.nativeElement.placeholder = 'Please enter new password';
      this.newPassword.nativeElement.classList.add('invalid-input');
    }
  }

}
