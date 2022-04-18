import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

export interface User {
  email: string;
  password: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;

  user: User = {
    email: '',
    password: '',
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    if (this.isLoginMode) {
    } else {
      this.authService
        .signUp(email, password)
        .subscribe((resp) => console.log(resp));
      form.reset();
    }
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
