import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  CurrencyPipe,
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { IProduct } from '@/core/models';
import { ToastService } from '@/core/services/toast.service';
import { CartService } from '@/core/services/cart.service';
import { AuthService } from '@/core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FavoritesService } from '@/core/services/favorites.service';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, NgOptimizedImage],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `https://res.cloudinary.com/dy7luvgd5/image/upload/v1735063243/${config.src}`;
      },
    },
  ],
  templateUrl: './product-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  public product = input.required<IProduct>();

  private readonly toastService = inject(ToastService);
  private readonly cartService = inject(CartService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isAuthenticated = computed(() => !!this.authService.user());
  isFavorite = computed(() => this.favoritesService.hasProduct(this.product()));

  addToCart(product: IProduct) {
    if (!this.isAuthenticated()) {
      this.toastService.showToast(
        `You need to log in to add products to the cart.`,
        'error',
      );
      this.router.navigate(['/login']).then(() => {});
      return;
    }

    if (this.cartService.hasProductStock(product)) {
      this.cartService.addProduct$.next(product);
    } else {
      this.toastService.showToast(
        `Oops! This product is currently out of stock.`,
        'warning',
      );
    }
  }

  toggleFavorite(product: IProduct) {
    if (!this.isAuthenticated()) {
      this.toastService.showToast(
        `You need to log in to add products to the cart.`,
        'error',
      );
      return;
    }
    this.favoritesService.toggleFavorite$.next(product);
  }
}
