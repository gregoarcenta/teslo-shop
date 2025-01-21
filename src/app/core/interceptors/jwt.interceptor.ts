import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '@/core/services/auth.service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const autService = inject(AuthService);

  const token = autService.getTokenJwt();

  if (!token) return next(req);

  const newReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(newReq);
};
