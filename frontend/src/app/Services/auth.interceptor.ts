import { HttpHeaders, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { AuthResponse } from '../Models/auth-response';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { exhaustMap, take } from 'rxjs';
import { User } from '../Models/User.model';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService: AuthService = inject(AuthService);

  const path = "api/v1/auth";
  if(req.url.endsWith(`${path}/checkUsername`) || 
    req.url.endsWith(`${path}/login`) || 
    req.url.endsWith(`${path}/signup`))
  {
    return next(req);
  }
  else
  {  
    return authService.user.pipe(take(1), exhaustMap(user => {
      if (!user)
      {
        return next(req);
      }
      else
      {
        // const modifedReq = req.clone({params: new HttpParams().set('auth', user.token!)})
        const modifedReq = req.clone({
          headers: new HttpHeaders().set('Authorization', `Bearer ${user.token}`)
        })

        return next(modifedReq)
      }
    }))
    
  }

};
