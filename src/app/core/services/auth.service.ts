import {
  inject,
  Injectable,
  InjectionToken,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { IApiResponse, IAuthUser, IUser } from '@/core/models';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { ToastService } from '@/core/services/toast.service';
import { isPlatformBrowser } from '@angular/common';

export const SERVER_JWT_TOKEN = new InjectionToken<string>('SERVER_JWT_TOKEN');
export const JWT_TOKEN_NAME = 'teslo_auth_token';

interface ILoginParams {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.baseUrl;
  public user = signal<IUser | null>(null);

  // Services
  private readonly serverJwt = inject(SERVER_JWT_TOKEN, { optional: true });
  private readonly cookie = inject(SsrCookieService);
  private readonly toastService = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);

  isAuthenticated(): Observable<boolean> {
    const token =
      this.serverJwt ??
      (this.cookie.check(JWT_TOKEN_NAME)
        ? this.cookie.get(JWT_TOKEN_NAME)
        : null);

    if (!token) return of(false);

    if (this.user()) return of(true);

    return this.http
      .get<IApiResponse<IAuthUser>>(`${this.baseUrl}/api/auth/check-status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        shareReplay(1),
        map(({ data: authUser }) => {
          this.authenticateUser(authUser);
          return true;
        }),
        catchError(({ error }) => {
          console.error(error.message);
          this.logout();
          if (isPlatformBrowser(this.platformId)) {
            this.toastService.showToast(
              'Your session has expired. Please log in again.',
              'warning',
            );
          }
          return of(false);
        }),
      );
  }

  login(loginParams: ILoginParams): Observable<string> {
    const apiUrl = `${this.baseUrl}/api/auth/signin`;
    return this.http.post<IApiResponse<IAuthUser>>(apiUrl, loginParams).pipe(
      map(({ data: authUser, message }) => {
        this.authenticateUser(authUser);
        return message;
      }),
    );
  }

  logout() {
    this.user.set(null);
    this.cookie.delete(JWT_TOKEN_NAME);
  }

  authenticateUser({ user, accessToken }: IAuthUser): void {
    this.user.set(user);
    this.cookie.set(JWT_TOKEN_NAME, accessToken);
  }
}
