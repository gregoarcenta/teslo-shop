import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ICart, ICartItem } from '@/core/models/cart';
import { IApiResponse } from '@/core/models';

@Injectable({
  providedIn: 'root',
})
export class ApiCartService {
  private readonly baseUrl = environment.baseUrl;

  private readonly http = inject(HttpClient);

  getCart(): Observable<ICart> {
    const apiUrl = `${this.baseUrl}/api/cart`;
    return this.http
      .get<IApiResponse<ICart>>(apiUrl)
      .pipe(map(({ data: cart }) => cart));
  }

  addProduct(cartId: string, productId: string): Observable<ICartItem> {
    const apiUrl = `${this.baseUrl}/api/cart/item`;
    const body = { cartId, productId };
    return this.http
      .post<IApiResponse<ICartItem>>(apiUrl, body)
      .pipe(map(({ data: cartItem }) => cartItem));
  }

  updateProduct(
    cartId: string,
    productId: string,
    quantity: number,
  ): Observable<ICartItem> {
    const apiUrl = `${this.baseUrl}/api/cart/item`;
    const body = { cartId, productId, quantity };
    return this.http
      .patch<IApiResponse<ICartItem>>(apiUrl, body)
      .pipe(map(({ data: cartItem }) => cartItem));
  }

  removeProduct(cartId: string, productId: string): Observable<string> {
    const apiUrl = `${this.baseUrl}/api/cart/item`;
    const body = { cartId, productId };

    return this.http
      .delete<IApiResponse<null>>(apiUrl, { body })
      .pipe(map(({ message }) => message));
  }

  cleanCart(): Observable<string> {
    const apiUrl = `${this.baseUrl}/api/cart`;
    return this.http
      .delete<IApiResponse<null>>(apiUrl)
      .pipe(map(({ message }) => message));
  }
}
