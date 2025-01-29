import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IApiResponse } from '@/core/models';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IOrderPaginate, OrderStatus } from '@/core/models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly baseUrl = environment.baseUrl;

  private readonly http = inject(HttpClient);

  public limit = signal<number>(5);

  getOrders(page: number, status?: OrderStatus): Observable<IOrderPaginate> {
    let params = new HttpParams()
      .set('limit', this.limit())
      .set('offset', (page - 1) * this.limit());

    if (status) params = params.set('status', status);

    const apiUrl = `${this.baseUrl}/api/orders/user`;

    return this.http
      .get<IApiResponse<IOrderPaginate>>(apiUrl, { params })
      .pipe(map(({ data }) => data));
  }
}
