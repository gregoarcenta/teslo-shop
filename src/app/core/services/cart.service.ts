import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { map, mergeMap, Observer, Subject, switchMap, tap } from 'rxjs';
import { ICart } from '@/core/models/cart';
import { ToastService } from '@/core/services/toast.service';
import { ApiCartService } from '@/core/services/api-cart.service';
import { IProduct } from '@/core/models';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

interface Item {
  cartId: string;
  productId: string;
  quantity?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // SERVICES
  private readonly toastService = inject(ToastService);
  private readonly apiCart = inject(ApiCartService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  //SIGNALS
  public cart = signal<ICart | null>(null);
  public isLoading = signal<boolean>(false);

  public getCart$ = new Subject<void>();
  public cleanCart$ = new Subject<void>();
  public addProduct$ = new Subject<IProduct>();
  public removeProduct$ = new Subject<IProduct>();
  public updateProduct$ = new Subject<{
    product: IProduct;
    quantity: number;
  }>();

  private cartObserver: Observer<any> = {
    next: () => this.getCart$.next(),
    error: (error) => this.handleError(error),
    complete: () => console.log('complete'),
  };

  constructor() {
    // GET CART
    this.getCart$
      .pipe(
        tap(() => this.isLoading.set(true)),
        switchMap(() => this.apiCart.getCart()),
        tap(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (cart) => this.cart.set(cart),
        error: (error) => this.handleError(error),
      });

    // CLEAN CART
    this.cleanCart$
      .pipe(
        tap(() => this.cleanCart()),
        switchMap(() => this.apiCart.cleanCart()),
      )
      .subscribe(this.cartObserver);

    // ADD PRODUCT TO CART
    this.addProduct$
      .pipe(
        map((product) => this.addProduct(product)),
        mergeMap((e: Item) => this.apiCart.addProduct(e.cartId, e.productId)),
      )
      .subscribe(this.cartObserver);

    // UPDATE PRODUCT TO CART
    this.updateProduct$
      .pipe(
        map((p) => this.updateProduct(p.product, p.quantity)),
        switchMap((e: Item) =>
          this.apiCart.updateProduct(e.cartId, e.productId, e.quantity!),
        ),
      )
      .subscribe(this.cartObserver);

    //REMOVE PRODUCT FROM CART
    this.removeProduct$
      .pipe(
        map((product) => this.removeProduct(product)),
        mergeMap((e: Item) =>
          this.apiCart.removeProduct(e.cartId, e.productId),
        ),
      )
      .subscribe(this.cartObserver);
  }

  private addProduct(product: IProduct): Item {
    const cart = this.cart();
    if (!cart) throw new Error('Cart is not initialized.');
    const cartItems = cart.cartItems;

    const existingCartItem = cartItems.find(
      (item) => item.product.id === product.id,
    );

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      cartItems.push({ id: product.id, product, quantity: 1 });
    }

    this.cart.update((cart) => ({
      ...cart!,
      cartItems: [...cartItems],
    }));

    this.toastService.showToast(
      `${product.title} has been added to cart`,
      'success',
    );

    return { cartId: cart.id, productId: product.id };
  }

  private updateProduct(product: IProduct, quantity: number): Item {
    const cart = this.cart();
    if (!cart) throw new Error('Cart is not initialized.');
    const cartItems = cart.cartItems;

    const existingCartItem = cartItems.find(
      (item) => item.product.id === product.id,
    )!;

    existingCartItem.quantity += quantity;

    this.cart.update((cart) => ({
      ...cart!,
      cartItems: [...cartItems],
    }));

    return {
      cartId: cart.id,
      productId: product.id,
      quantity: existingCartItem.quantity,
    };
  }

  private removeProduct(product: IProduct): Item {
    const cart = this.cart();
    if (!cart) throw new Error('Cart is not initialized.');
    const cartItems = cart.cartItems;

    this.cart.update((cart) => ({
      ...cart!,
      cartItems: cartItems.filter((it) => it.product.id !== product.id)!,
    }));

    this.toastService.showToast(
      `${product.title} has been removed to cart`,
      'success',
    );

    return { cartId: cart.id, productId: product.id };
  }

  private cleanCart(): void {
    const cart = this.cart();
    if (!cart) throw new Error('Cart is not initialized.');

    this.cart.update((cart) => {
      return {
        ...cart!,
        cartItems: [],
        total: '0.00',
      };
    });

    this.toastService.showToast(`cart has been emptied`, 'success');
  }

  hasProductStock(product: IProduct): boolean {
    const cart = this.cart();
    if (!cart) throw new Error('Cart is not initialized.');
    const quantity =
      cart.cartItems.find((it) => it.product.id === product.id)?.quantity ?? 0;
    return quantity < product.stock;
  }

  private handleError(error: any): void {
    console.error(error.message);
    this.isLoading.set(false);
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/']).then(() => {
        this.toastService.showToast(
          'There was an issue loading the cart. Please reload the page or try again later.',
          'warning',
          false,
        );
      });
    }
  }
}
