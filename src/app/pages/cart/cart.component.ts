import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CurrencyPipe,
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
  SlicePipe,
} from '@angular/common';
import { CartService } from '@/core/services/cart.service';
import { IProduct } from '@/core/models';
import { PaymentService } from '@/core/services/payment.service';
import { ToastService } from '@/core/services/toast.service';
import { FavoritesService } from '@/core/services/favorites.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, NgOptimizedImage, SlicePipe, CurrencyPipe],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `https://res.cloudinary.com/dy7luvgd5/image/upload/v1735063243/${config.src}`;
      },
    },
  ],
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CartComponent implements OnInit {
  // SERVICES
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);
  private readonly paymentService = inject(PaymentService);
  private readonly favoritesService = inject(FavoritesService);

  // SIGNALS
  public isLoadingPayment = signal<boolean>(false);
  public cart = computed(() => this.cartService.cart());
  public isLoadingPrice = computed(() => this.cartService.isLoading());

  ngOnInit(): void {
    this.cartService.getCart$.next();
  }

  updateProductFromCart(product: IProduct, quantity: number) {
    const item = this.cart()?.cartItems.find(
      (c) => c.product.id === product.id,
    )!;

    if (quantity === +1 && item.quantity >= item.product.stock) return;

    if (quantity === -1 && item.quantity === 1) return;

    this.cartService.isLoading.set(true);

    this.cartService.updateProduct$.next({ product, quantity });
  }

  removeProductFromCart(product: IProduct) {
    this.cartService.isLoading.set(true);
    this.cartService.removeProduct$.next(product);
  }

  proceedCheckout() {
    this.isLoadingPayment.set(true);
    this.paymentService.proceedCheckout().subscribe({
      next: (paymentUrl) => {
        this.isLoadingPayment.set(false);
        window.location.href = paymentUrl;
      },
      error: (err) => {
        this.toastService.showToast(err.message, 'error', false);
        setTimeout(() => (window.location.href = '/'), 5000);
      },
    });
  }

  isFavorite(product: IProduct): boolean {
    return this.favoritesService.hasProduct(product);
  }

  toggleFavorite(product: IProduct) {
    this.favoritesService.toggleFavorite$.next(product);
  }
}
