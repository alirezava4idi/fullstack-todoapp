import { Injectable, inject } from '@angular/core';
import { User } from '../Models/User.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, Subject, catchError, tap, throwError } from 'rxjs';
import { LoggingService } from './logging.service';
import { AuthResponse } from '../Models/auth-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URL = 'http://localhost:3000/api/v1/auth';
  // URL = 'http://todo:3000/api/v1/auth';

  httpClient: HttpClient = inject(HttpClient);
  loggingService: LoggingService = inject(LoggingService);
  router: Router = inject(Router);

  errSubject: Subject<HttpErrorResponse> = new Subject<HttpErrorResponse>();

  private tokenExpireTimer: any;

  // @ts-ignore
  user = new BehaviorSubject<User>();


  signup(username: string, password: string)
  {
    const data = {username: username, password: password}
    return this.httpClient.post<AuthResponse>(`${this.URL}/signup`, data, {
      headers: {
        'content-type': 'application/json'
      }
    }).pipe(
      catchError(this.handleError),
      tap((res) => {
        this.handleCreateUser(res);
      })
      )
  }
  
  login(username: string, password: string)
  {
    const data = {username, password}
    return this.httpClient.post<AuthResponse>(`${this.URL}/login`, data)
    .pipe(
      catchError(this.handleError),
      tap((res) => {
        this.handleCreateUser(res);
      })
      )
  }

  logout()
  {
    //@ts-ignore
    this.user.next(null);
    this.router.navigate(['/Login']);
    localStorage.removeItem('user');

    if (this.tokenExpireTimer){
      clearTimeout(this.tokenExpireTimer);
    }

    this.tokenExpireTimer = null;
  }


  isUsernameValid(username: string): Observable<any>
  {
    return this.httpClient.post(`${this.URL}/checkUsername`, {username}, {
      headers: {'Content-type': 'application/json'}
    }).pipe(
      catchError(this.handleError)
    );
  }

  autoLogin()
  {
    const user: User = JSON.parse(localStorage.getItem('user')!);
 

    if(!user)
    {
      return;
    }

    //@ts-ignore
    const loggedUser = new User(user.username, user.id, user._token, user._expiresIn);
    if (loggedUser.token)
    {
      this.user.next(loggedUser);
      //@ts-ignore
      const timerValue = new Date(user._expiresIn).getTime() - new Date().getTime();
      this.autoLogout(timerValue);
    }
  }

  autoLogout(expireTime: number)
  {
    this.tokenExpireTimer = setTimeout(() => {
      this.logout();
    }, expireTime)
  }

  private handleCreateUser(res: AuthResponse)
  {
    const expiresInTs = new Date().getTime() + +res.expireTime;
    const expiresIn = new Date(expiresInTs);
    // //console.log('create user', expiresIn);
    const createdUser = new User(res.username, res.uuid, res.token, expiresIn.toLocaleString());
    this.user.next(createdUser);
    this.autoLogout(res.expireTime);

    localStorage.setItem('user', JSON.stringify(createdUser));
  }

  private handleError(err: any)
  {
    
    let errorMessage = 'an unknown error has occured';
    if (!err || !err.error || !err.error.error)
    {
      return throwError(() => errorMessage);
    }
    errorMessage = err.error.error
    return throwError(() => errorMessage);
  }

  
}
