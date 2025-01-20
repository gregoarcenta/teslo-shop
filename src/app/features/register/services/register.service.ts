import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { IApiResponse, IAuthUser } from '@/core/models';
import { AuthService } from '@/core/services/auth.service';

interface ICreateAccountParams {
  fullName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private readonly baseUrl = environment.baseUrl;

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  createAccount(createAccountParams: ICreateAccountParams): Observable<string> {
    const apiUrl = `${this.baseUrl}/api/auth/signup`;
    return this.http
      .post<IApiResponse<IAuthUser>>(apiUrl, createAccountParams)
      .pipe(
        map(({ data: authUser, message }) => {
          this.authService.authenticateUser(authUser);
          return message;
        }),
      );
  }
}
