import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('password') password: ElementRef;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  login(value){
    if(value.length != 0){
      if(value === '12345'){
        this.router.navigate(['main']);
      }
      else{
        this.password.nativeElement.value = '';
        this.password.nativeElement.classList.add('invalid-password');
        this.password.nativeElement.placeholder = 'Invalid password';
      }
    }
    else{
      this.password.nativeElement.placeholder = 'Please enter the password';
      this.password.nativeElement.classList.add('invalid-password');
    }
  }

}
