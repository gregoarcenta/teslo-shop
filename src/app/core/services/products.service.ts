import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IApiResponse, IProduct } from '@/core/models';
import { IPaginateProducts, ProductType } from '@/core/models/product';

export interface FilterOptions {
  page: number;
  type?: ProductType;
  order?: orderBy;
  term: string;
}

export type orderBy = 'newest' | 'increasingPrice' | 'decreasingPrice';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly baseUrl = environment.baseUrl;

  public limit = signal<number>(8);
  public isShowPlaceholder = signal<boolean>(false);
  public noProductsFound = signal<boolean>(false);
  public products = signal<IProduct[]>([]);
  public totalItems = signal<number>(0);
  public filterState = signal<FilterOptions>({
    page: 1,
    type: undefined,
    order: 'newest',
    term: '',
  });

  private readonly http = inject(HttpClient);

  findAll(filterOptions: FilterOptions): Observable<IProduct[]> {
    const { page, type, order, term } = filterOptions;
    const offset = (page - 1) * this.limit();

    let params = new HttpParams()
      .set('limit', this.limit())
      .set('offset', offset);

    if (type) params = params.set('type', type);
    if (order) params = params.set('order', order);
    if (term) params = params.set('term', term);

    const apiUrl = `${this.baseUrl}/api/products`;

    if (page === 1) this.isShowPlaceholder.set(true);
    this.noProductsFound.set(false);
    return this.http
      .get<IApiResponse<IPaginateProducts>>(apiUrl, { params })
      .pipe(
        map(({ data }) => {
          this.totalItems.set(data.totalItems);
          this.filterState.set(filterOptions);
          this.isShowPlaceholder.set(false);

          if (data.products.length === 0) {
            this.noProductsFound.set(true);
          } else {
            this.noProductsFound.set(false);
          }

          return data.products;
        }),
      );
  }

  cleanFilters() {
    this.filterState.set({
      page: 1,
      type: undefined,
      order: 'newest',
      term: '',
    });
    this.products.set([]);
  }
}
