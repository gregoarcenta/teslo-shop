import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import {
  FilterOptions,
  orderBy,
  ProductsService,
} from '@/core/services/products.service';
import { Router, RouterLink } from '@angular/router';
import {
  CurrencyPipe,
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { FlowbiteService } from '@/core/services/flowbite.service';
import { initDropdowns, initTooltips } from 'flowbite';
import { ToastService } from '@/core/services/toast.service';
import { AuthService } from '@/core/services/auth.service';
import { CartService } from '@/core/services/cart.service';
import { IProduct } from '@/core/models';
import { ProductsSkeletonComponent } from '@/shared/components/products-skeleton/products-skeleton.component';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    NgOptimizedImage,
    CurrencyPipe,
    ProductsSkeletonComponent,
  ],
  templateUrl: './home.component.html',
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `https://res.cloudinary.com/dy7luvgd5/image/upload/v1735063243/${config.src}`;
      },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent implements OnInit, AfterViewInit {
  // VIEW REFERENCES
  private readonly sortProdDropdownBtn = viewChild('sortProdDropdownBtn', {
    read: ElementRef,
  });
  private readonly productCardElements = viewChildren('productCard', {
    read: ElementRef,
  });

  // SERVICES
  private readonly productsService = inject(ProductsService);
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly toastService = inject(ToastService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);

  // SIGNALS
  public orderByArray = signal<orderBy[]>([
    'newest',
    'increasingPrice',
    'decreasingPrice',
  ]);

  isLoading = signal<boolean>(false);
  public isAuthenticated = computed(() => {
    return !!this.authService.user();
  });
  isShowPlaceholder = computed(() => this.productsService.isShowPlaceholder());
  noProductsFound = computed(() => this.productsService.noProductsFound());
  filterState = computed(() => this.productsService.filterState());
  products = computed(() => this.productsService.products());
  totalItems = computed(() => this.productsService.totalItems());
  page = computed(() => this.productsService.filterState().page);

  ngOnInit() {
    this.meta.updateTag({
      name: 'description',
      content:
        'Explore our wide array of products in our ecommerce home. Find great deals and the latest products now!',
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'ecommerce, products, deals, online shopping, portfolio',
    });

    this.meta.updateTag({
      name: 'og:title',
      content: 'Welcome to Our Ecommerce Home',
    });
    this.meta.updateTag({
      name: 'og:description',
      content:
        'Explore a variety of products with amazing deals in our ecommerce home. Check out the latest and greatest now!',
    });

    if (this.products().length === 0) this.loadPage(1);
  }

  ngAfterViewInit(): void {
    this.flowbiteService.loadFlowbite(() => {
      initDropdowns();
      initTooltips();
    });
  }

  loadPage(pageNumber: number) {
    const newFilterState: FilterOptions = {
      ...this.filterState(),
      page: pageNumber,
    };
    this.isLoading.set(true);
    this.productsService.findAll(newFilterState).subscribe({
      next: (products) => {
        this.isLoading.set(false);
        this.productsService.products.update((currentProducts) => [
          ...currentProducts,
          ...products,
        ]);
        this.scrollTLastElement();
      },
    });
  }

  sortProducts(order: orderBy) {
    const newFilterState: FilterOptions = {
      ...this.filterState(),
      page: 1,
      order,
    };

    this.closeDropdown(this.sortProdDropdownBtn()!);
    this.productsService.findAll(newFilterState).subscribe({
      next: (products) => {
        this.productsService.products.set(products);
        this.scrollTLastElement();
      },
    });
  }

  cleanFilterState() {
    this.productsService.cleanFilters();
    const search = document.getElementById(
      'search-dropdown',
    ) as HTMLInputElement;
    const searchMb = document.getElementById('search') as HTMLInputElement;
    if (search) search.value = '';
    if (searchMb) searchMb.value = '';
    this.loadPage(1);
  }

  closeDropdown(dropdownBtn: ElementRef) {
    dropdownBtn.nativeElement.focus();
    dropdownBtn.nativeElement.click();
  }

  scrollTLastElement() {
    setTimeout(() => {
      const lastVisibleElement =
        this.productCardElements()[this.products().length - 9];
      if (lastVisibleElement) {
        lastVisibleElement.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  }

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
}
