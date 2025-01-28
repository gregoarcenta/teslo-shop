import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
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

  // SIGNALS
  public cart = computed(() => this.cartService.cart());
  public isLoading = computed(() => this.cartService.isLoading());

  ngOnInit(): void {
    this.cartService.getCart$.next();
  }

  updateProductFromCart(product: IProduct, quantity: number) {
    const item = this.cart()?.cartItems.find(
      (c) => c.product.id === product.id,
    )!;

    if (quantity === +1 && item.quantity >= item.product.stock) return;

    if (quantity === -1 && item.quantity === 1) return;

    this.cartService.updateProduct$.next({ product, quantity });
  }

  removeProductFromCart(product: IProduct) {
    this.cartService.removeProduct$.next(product);
  }
}
