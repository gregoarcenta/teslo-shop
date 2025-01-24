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

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements AfterViewInit {
  private readonly userDropdownBtn = viewChild('userDropdownButton', {
    read: ElementRef,
  });
  private readonly prodTypeDropdownBtn = viewChild('prodTypeDropdownBtn', {
    read: ElementRef,
  });

  private readonly authService = inject(AuthService);
  private readonly productsService = inject(ProductsService);
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly router = inject(Router);

  public showInputSearch = signal<boolean>(false);
  public productTypes = signal<ProductType[]>(Object.values(ProductType));
  public filterState = computed(() => this.productsService.filterState());

  public isAuthenticated = computed(() => {
    return !!this.authService.user();
  });

  public termGroup = new FormGroup({
    term: new FormControl('', [Validators.required]),
  });

  // public termControl = new FormControl('', Validators.required);

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

  closeDropdown(dropdownBtn: ElementRef) {
    dropdownBtn.nativeElement.focus();
    dropdownBtn.nativeElement.click();
  }
}
