import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, switchMap, tap } from 'rxjs';
import { IApiResponse, IProduct } from '@/core/models';
import { ToastService } from '@/core/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly baseUrl = environment.baseUrl;
  private readonly apiUrl = `${this.baseUrl}/api/favorites`;

  public products = signal<IProduct[]>([]);

  public getFavorites$ = new Subject<void>();
  public toggleFavorite$ = new Subject<IProduct>();

  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);

  constructor() {
    // GET FAVORITES
    this.getFavorites$
      .pipe(switchMap(() => this.getFavorites()))
      .subscribe((products) => this.products.set(products));

    // ADD FAVORITE
    this.toggleFavorite$
      .pipe(
        tap((product) => this.toggleFavoriteLocal(product)),
        switchMap((product) => this.toggleFavorite(product.id)),
      )
      .subscribe((message) => {
        this.getFavorites$.next();
        this.toastService.showToast(message, 'success');
      });
  }

  getFavorites(): Observable<IProduct[]> {
    return this.http
      .get<IApiResponse<IProduct[]>>(this.apiUrl)
      .pipe(map(({ data: products }) => products));
  }

  private toggleFavorite(productId: string): Observable<string> {
    return this.http
      .post<IApiResponse<null>>(this.apiUrl, { productId })
      .pipe(map(({ message }) => message));
  }

  private toggleFavoriteLocal(product: IProduct) {
    if (this.hasProduct(product)) {
      this.products.update((products) =>
        products.filter((p) => p.id !== product.id),
      );
    } else {
      this.products.update((products) => [...products, product]);
    }
  }

  hasProduct(product: IProduct): boolean {
    return this.products().some((p) => p.id === product.id);
  }
}
