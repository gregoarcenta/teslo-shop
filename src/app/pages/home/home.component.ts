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
import { RouterLink } from '@angular/router';
import {
  CurrencyPipe,
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { FlowbiteService } from '@/core/services/flowbite.service';
import { initDropdowns, initTooltips } from 'flowbite';
import { ProductSkeletonComponent } from '@/shared/components/product-skeleton/product-skeleton.component';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    NgOptimizedImage,
    CurrencyPipe,
    ProductSkeletonComponent,
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
  private readonly sortProdDropdownBtn = viewChild('sortProdDropdownBtn', {
    read: ElementRef,
  });

  private readonly productsService = inject(ProductsService);
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly meta = inject(Meta);

  private readonly productCardElements = viewChildren('productCard', {
    read: ElementRef,
  });

  public orderByArray = signal<orderBy[]>([
    'newest',
    'increasingPrice',
    'decreasingPrice',
  ]);

  isLoading = signal<boolean>(false);

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
    // this.meta.updateTag({ name: 'og:image', content: 'URL_of_your_image' });

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
      error: (error) => {
        console.log('ERROR AL OBTENER LOS PRODUCTOS', error);
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
      error: (error) => {
        console.log('ERROR AL OBTENER LOS PRODUCTOS', error);
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

  getRandomNumber() {
    return Math.floor(Math.random() * 2) + 1;
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
}
