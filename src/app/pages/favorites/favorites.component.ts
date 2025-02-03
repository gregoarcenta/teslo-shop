import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProductsGridComponent } from '@/shared/components/products-grid/products-grid.component';
import { FavoritesService } from '@/core/services/favorites.service';
import { ProductsSkeletonComponent } from '@/shared/components/products-skeleton/products-skeleton.component';

@Component({
  selector: 'app-favorites',
  imports: [ProductsGridComponent, ProductsSkeletonComponent],
  templateUrl: './favorites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FavoritesComponent implements OnInit {
  private readonly favoritesService = inject(FavoritesService);

  public LoadingFavorites = signal<boolean>(true);

  products = computed(() => this.favoritesService.products());

  ngOnInit() {
    this.favoritesService.getFavorites().subscribe((products) => {
      this.favoritesService.products.set(products);
      this.LoadingFavorites.set(false);
    });
  }
}
