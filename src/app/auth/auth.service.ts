import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

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
      .pipe(catchError(this.handleError));
  }

  private handleError(errorResp: HttpErrorResponse): Observable<never> {
    // just a test ... more could would go here
    return throwError(() => {
      let errorText = 'An unknown error occured';
      if (!errorResp.error || !errorResp.error.error) {
        return new Error(errorText);
      }

      console.log(errorResp);
      debugger;
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
