import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@/core/services/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    take(1),
    map((isAuth) => {
      if (isAuth) return true;
      router.navigate(['/login']).then((_) => {});
      return false;
    }),
  );
};
