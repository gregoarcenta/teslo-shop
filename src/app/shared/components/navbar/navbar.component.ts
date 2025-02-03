import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AuthService } from '@/core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FlowbiteService } from '@/core/services/flowbite.service';
import { initDropdowns, initTooltips } from 'flowbite';
import { IProduct, ProductType } from '@/core/models/product';
import { ProductsService } from '@/core/services/products.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CurrencyPipe,
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { CartService } from '@/core/services/cart.service';
import { UserModalComponent } from '@/shared/components/user-modal/user-modal.component';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CurrencyPipe,
    NgOptimizedImage,
    UserModalComponent,
  ],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `https://res.cloudinary.com/dy7luvgd5/image/upload/v1735063243/${config.src}`;
      },
    },
  ],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements AfterViewInit {
  // VIEW REFERENCES
  private readonly userDropdownBtn = viewChild('userDropdownButton', {
    read: ElementRef,
  });
  private readonly cartDropdownBtn = viewChild('cartDropdownButton', {
    read: ElementRef,
  });
  private readonly prodTypeDropdownBtn = viewChild('prodTypeDropdownBtn', {
    read: ElementRef,
  });

  // SERVICES
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  // SIGNALS
  public showInputSearch = signal<boolean>(false);
  public productTypes = signal<ProductType[]>(Object.values(ProductType));
  public filterState = computed(() => this.productsService.filterState());
  public cart = computed(() => this.cartService.cart());

  public isAuthenticated = computed(() => !!this.authService.user());

  // INPUT SEARCH FORM GROUP
  public termGroup = new FormGroup({
    term: new FormControl('', [Validators.required]),
  });

  ngAfterViewInit(): void {
    this.flowbiteService.loadFlowbite(() => {
      initDropdowns();
      initTooltips();
    });
  }

  onChangeProductType = (productType: ProductType) => {
    const newFilterState = {
      ...this.filterState(),
      type: productType,
      page: 1,
    };
    this.closeDropdown(this.prodTypeDropdownBtn()!);

    this.productsService.findAll(newFilterState).subscribe((products) => {
      this.productsService.products.set(products);
    });
  };

  onSearchProductByTerm = (term: string) => {
    const termValue = term.trim().toLowerCase();

    if (termValue.length < 1) return;

    const newFilterState = {
      ...this.filterState(),
      term: termValue,
      page: 1,
    };
    this.productsService.findAll(newFilterState).subscribe((products) => {
      this.productsService.products.set(products);
    });
  };

  onToggleInputSearch() {
    this.showInputSearch.update((currentValue) => !currentValue);
  }

  login() {
    return this.router.navigate(['login']);
  }

  logout() {
    this.authService.logout();
    this.closeDropdown(this.userDropdownBtn()!);
    return this.router.navigate(['login']);
  }

  removeProductFromCart(product: IProduct) {
    this.cartService.removeProduct$.next(product);
  }

  goProductRoute(slug: string) {
    this.closeDropdown(this.cartDropdownBtn()!);
    this.router.navigate(['/', slug]).then(() => {});
  }

  goCartRoute() {
    this.closeDropdown(this.cartDropdownBtn()!);
    this.router.navigate(['cart']).then(() => {});
  }

  goOrdersRoute() {
    this.closeDropdown(this.userDropdownBtn()!);
    this.router.navigate(['orders']).then(() => {});
  }

  goFavoritesRoute() {
    this.closeDropdown(this.userDropdownBtn()!);
    this.router.navigate(['favorites']).then(() => {});
  }

  closeDropdown(dropdownBtn: ElementRef) {
    dropdownBtn.nativeElement.focus();
    dropdownBtn.nativeElement.click();
  }
}
