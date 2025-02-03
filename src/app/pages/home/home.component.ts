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
} from '@angular/core';
import {
  FilterOptions,
  orderBy,
  ProductsService,
} from '@/core/services/products.service';
import { Meta } from '@angular/platform-browser';
import { FlowbiteService } from '@/core/services/flowbite.service';
import { initDropdowns, initTooltips } from 'flowbite';
import { ProductsSkeletonComponent } from '@/shared/components/products-skeleton/products-skeleton.component';
import { ProductsGridComponent } from '@/shared/components/products-grid/products-grid.component';

@Component({
  selector: 'app-home',
  imports: [ProductsSkeletonComponent, ProductsGridComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent implements OnInit, AfterViewInit {
  // VIEW REFERENCES
  private readonly productGridElement = viewChild(ProductsGridComponent);
  private readonly sortProdDropdownBtn = viewChild('sortProdDropdownBtn', {
    read: ElementRef,
  });

  // SERVICES
  private readonly productsService = inject(ProductsService);
  private readonly flowbiteService = inject(FlowbiteService);

  private readonly meta = inject(Meta);

  // SIGNALS
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
      const cards = this.productGridElement()?.productCardElements();

      const lastVisibleElement = !!cards
        ? cards[this.products().length - 9]
        : null;

      if (lastVisibleElement) {
        lastVisibleElement.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  }
}
