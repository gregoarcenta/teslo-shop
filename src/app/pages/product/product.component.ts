import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsService } from '@/core/services/products.service';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { IProduct } from '@/core/models';
import {
  CurrencyPipe,
  IMAGE_LOADER,
  ImageLoaderConfig,
  isPlatformBrowser,
  NgOptimizedImage,
} from '@angular/common';
import { AuthService } from '@/core/services/auth.service';
import { ToastService } from '@/core/services/toast.service';
import { CartService } from '@/core/services/cart.service';
import { ProductSkeletonComponent } from '@/shared/components/product-skeleton/product-skeleton.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  imports: [NgOptimizedImage, CurrencyPipe, ProductSkeletonComponent],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `https://res.cloudinary.com/dy7luvgd5/image/upload/v1735063243/${config.src}`;
      },
    },
  ],
  templateUrl: './product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductComponent {
  // SERVICES
  private readonly platformId = inject(PLATFORM_ID);
  private readonly productsService = inject(ProductsService);
  private readonly toastService = inject(ToastService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);
  private title = inject(Title);

  //SIGNALS
  public product = signal<IProduct | null>(null);
  public currentImage = signal<string>('');
  public isAuthenticated = computed(() => !!this.authService.user());

  constructor() {
    this.route.paramMap
      .pipe(
        takeUntilDestroyed(),
        tap(() => this.product.set(null)),
        map<ParamMap, string>((params) => params.get('slug') ?? ''),
        switchMap((slug) => this.productsService.findOne(slug)),
        catchError<IProduct, Observable<null>>(() => of(null)),
      )
      .subscribe((product) => {
        if (!product && isPlatformBrowser(this.platformId)) {
          this.router.navigate(['404']).then(() => {});
        }
        if (product) {
          this.addMetaTags(product);
          this.product.set(product);
          this.currentImage.set(product!.images[0]);
        }
      });
  }

  addMetaTags(product: IProduct) {
    this.meta.updateTag({ name: 'description', content: product.description });
    this.meta.updateTag({
      name: 'keywords',
      content: `ecommerce, ${product.title}, ${product.type}, buy online, shopping`,
    });
    this.meta.updateTag({ name: 'og:title', content: product.title });
    this.meta.updateTag({
      name: 'og:description',
      content: product.description,
    });
    this.meta.updateTag({
      name: 'og:image',
      content: `https://res.cloudinary.com/dy7luvgd5/image/upload/v1735063243/${product.images[0]}`,
    });
    // this.meta.updateTag({
    //   name: 'og:url',
    //   content: `${this.baseUrl}/product/${product.id}`,
    // });
    this.title.setTitle(`${product.title} | Teslo Shop`);
  }

  addToCart() {
    if (!this.isAuthenticated()) {
      this.toastService.showToast(
        `You need to log in to add products to the cart.`,
        'error',
      );
      this.router.navigate(['/login']).then(() => {});
      return;
    }

    if (this.cartService.hasProductStock(this.product()!)) {
      this.cartService.addProduct$.next(this.product()!);
    } else {
      this.toastService.showToast(
        `Oops! This product is currently out of stock.`,
        'warning',
      );
    }
  }

  changeImage(image: string) {
    this.currentImage.set(image);
  }
}
