import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthResponseData, AuthService } from './auth.service';
import { User } from './user.model';

// export interface User {
//   email: string;
//   password: string;
// }

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;
  errorText: string;
  // user: User = {
  email: '';
  password: '';
  // };
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkLoggedIn();
  }
  checkLoggedIn() {
    this.authService.user.pipe(
       take(1),
      map((user) => {
        console.log(user);
        const isAuth = !!user;
        if (isAuth) {
          this.router.navigate(['/recipes']);
        }
      })
    ).subscribe();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }
    authObs.subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (err) => {
        this.errorText = err;
        this.isLoading = false;
      },
    });
    form.reset();
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
