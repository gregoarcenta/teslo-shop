import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PaymentService } from '@/core/services/payment.service';
import { map } from 'rxjs';

export const paymentSessionSuccessGuard: CanActivateFn = (route, state) => {
  const paymentService = inject(PaymentService);
  const router = inject(Router);

  const token = route.queryParamMap.get('token');
  if (token) {
    return paymentService.validateSessionToken(token).pipe(
      map((isValidToken) => {
        if (isValidToken) {
          return true;
        } else {
          router.navigate(['/']).then(() => {});
          return false;
        }
      }),
    );
  } else {
    router.navigate(['/']).then(() => {});
    return false;
  }
};
