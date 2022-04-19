import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTime: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBPNVp2foDQNrGZ_JiWoAM_JTvYe2XlwHc',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBPNVp2foDQNrGZ_JiWoAM_JTvYe2XlwHc',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(
            res.email,
            res.localId,
            res.idToken,
            +res.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    localId: string,
    idToken: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.clear();
    if (this.tokenExpirationTime) {
      clearTimeout(this.tokenExpirationTime);
    }
    this.tokenExpirationTime = null;
  }

  autoLogin() {
    const user: {
      email: string;
      id: string;
      tokenExpirationDate: string;
      _token: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!user) {
      return;
    }
    const loadedUser = new User(
      user.email,
      user.id,
      user._token,
      new Date(user.tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(user.tokenExpirationDate).getTime() - new Date().getTime();

      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationTime: number) {
    console.log(expirationTime);
    this.tokenExpirationTime = setTimeout(() => {
      this.logout();
    }, expirationTime);
  }

  private handleError(errorResp: HttpErrorResponse): Observable<never> {
    // just a test ... more could would go here
    return throwError(() => {
      let errorText = 'An unknown error occured';
      if (!errorResp.error || !errorResp.error.error) {
        return new Error(errorText);
      }
      switch (errorResp.error.error.message) {
        case 'EMAIL_EXISTS':
          errorText = 'User Already Exists';
          break;
        case 'EMAIL_NOT_FOUND':
          errorText =
            'There is no user record corresponding to this identifier';
          break;
        case 'INVALID_PASSWORD':
          errorText =
            'The password is invalid or the user does not have a password.';
          break;
        case 'USER_DISABLED':
          errorText = 'The user account has been disabled by an administrator';
          break;
      }
      return errorText;
    });
  }
}

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
