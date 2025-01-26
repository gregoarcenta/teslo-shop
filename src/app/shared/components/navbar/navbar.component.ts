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
import { ProductType } from '@/core/models/product';
import { ProductsService } from '@/core/services/products.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartService } from '@/core/services/cart.service';
import {
  CurrencyPipe,
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { ToastService } from '@/core/services/toast.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ReactiveFormsModule, CurrencyPipe, NgOptimizedImage],
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
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  // SIGNALS
  public showInputSearch = signal<boolean>(false);
  public productTypes = signal<ProductType[]>(Object.values(ProductType));
  public filterState = computed(() => this.productsService.filterState());
  public cart = computed(() => this.cartService.cart());

  public isAuthenticated = computed(() => {
    return !!this.authService.user();
  });

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

  removeProductFromCart(productId: string) {
    this.cartService.cart.update((cart) => ({
      ...cart!,
      cartItems: cart!.cartItems.filter(
        (item) => item.product.id !== productId,
      ),
    }));

    this.cartService.removeProductFromCart(productId).subscribe({
      next: (successMessage) => {
        this.toastService.showToast(successMessage, 'success');
        this.cartService.getCart$.next();
      },
      error: ({ error }) => {
        this.toastService.showToast(error.message, 'error');
      },
    });
  }

  goCartRoute() {
    this.closeDropdown(this.cartDropdownBtn()!);
    this.router.navigate(['cart']).then(() => {});
  }

  closeDropdown(dropdownBtn: ElementRef) {
    dropdownBtn.nativeElement.focus();
    dropdownBtn.nativeElement.click();
  }
}
