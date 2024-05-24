import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { take, map } from 'rxjs';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user.pipe(take(1), map((user) => {
    const loggedIn = user ? true : false;
    // return true;
    if(loggedIn)
    {
      return true
    }
    else
    {
      return router.createUrlTree(['/Login'])
    }
  }))
};
