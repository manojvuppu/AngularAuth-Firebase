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
  errorText: string;
  user: User = {
    email: '',
    password: '',
  };
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;
    if (this.isLoginMode) {
      this.authService.login(email, password).subscribe({
        next: (res) => (this.isLoading = false),
        error: (err)=> {this.errorText = err;this.isLoading = false}
      });
      form.reset();
    } else {
      this.authService.signUp(email, password).subscribe({
        next: (res) => (this.isLoading = false),
        error: (err)=> {this.errorText = err;this.isLoading = false}
      });
      form.reset();
    }
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
