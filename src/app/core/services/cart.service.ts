import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, Subject, switchMap } from 'rxjs';
import { ICart, ICartItem } from '@/core/models/cart';
import { IApiResponse } from '@/core/models';
import { ToastService } from '@/core/services/toast.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly baseUrl = environment.baseUrl;

  public cart = signal<ICart | null>(null);
  public getCart$ = new Subject<void>();

  // SERVICES
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    this.getCart$
      .pipe(switchMap(() => this.getCart()))
      .subscribe((cart) => this.cart.set(cart));
  }

  private getCart(): Observable<ICart | null> {
    const apiUrl = `${this.baseUrl}/api/cart`;
    return this.http.get<IApiResponse<ICart>>(apiUrl).pipe(
      map(({ data: cart }) => cart),
      catchError(({ error }) => {
        console.error(error.message);
        if (isPlatformBrowser(this.platformId)) {
          this.toastService.showToast(
            'Unable to load your cart. Please try again.',
            'error',
            false,
          );
        }
        return of(null);
      }),
    );
  }

  addToCart(productId: string): Observable<ICartItem> {
    const apiUrl = `${this.baseUrl}/api/cart/item`;
    const body = { cartId: this.cart()?.id, productId };
    return this.http
      .post<IApiResponse<ICartItem>>(apiUrl, body)
      .pipe(map(({ data: cartItem }) => cartItem));
  }

  removeProductFromCart(productId: string): Observable<string> {
    const apiUrl = `${this.baseUrl}/api/cart/item`;
    const body = { cartId: this.cart()?.id, productId };

    return this.http
      .delete<IApiResponse<null>>(apiUrl, { body })
      .pipe(map(({ message }) => message));
  }
}
