import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new Subject<User>();

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
    const user = new User(email, idToken, localId, expirationDate);
    this.user.next(user);
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
