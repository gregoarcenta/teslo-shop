import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { IApiResponse } from '@/core/models';
import { IOrder } from '@/core/models/order';
import { CartService } from '@/core/services/cart.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly baseUrl = environment.baseUrl;

  private readonly http = inject(HttpClient);
  private readonly cartService = inject(CartService);

  proceedCheckout(): Observable<string> {
    return this.createOrder().pipe(
      switchMap((orderId) => this.createPaymentSession(orderId)),
      catchError((error) => {
        console.error('Error processing the payment: ', error.message);
        return throwError(() => new Error('Error processing the payment.'));
      }),
    );
  }

  createOrder(): Observable<string> {
    const apiUrl = `${this.baseUrl}/api/orders`;
    return this.http.post<IApiResponse<IOrder>>(apiUrl, {}).pipe(
      map(({ data: order }) => {
        this.cartService.cart.update((cart) => {
          return {
            ...cart!,
            cartItems: [],
            total: '0.00',
          };
        });
        return order.id;
      }),
      catchError(({ error }) => {
        return throwError(() => new Error(error.message));
      }),
    );
  }

  createPaymentSession(orderId: string): Observable<string> {
    const apiUrl = `${this.baseUrl}/api/payments/create-payment-session`;
    return this.http.post<IApiResponse<any>>(apiUrl, { orderId }).pipe(
      map(({ data }) => data.url),
      catchError(({ error }) => {
        return throwError(() => new Error(error.message));
      }),
    );
  }
}
