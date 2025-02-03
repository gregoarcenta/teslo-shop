import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  viewChildren,
} from '@angular/core';
import { IProduct } from '@/core/models';
import { ProductCardComponent } from '@/shared/components/product-card/product-card.component';

@Component({
  selector: 'app-products-grid',
  imports: [ProductCardComponent],
  templateUrl: './products-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsGridComponent {
  public products = input.required<IProduct[]>();

  public productCardElements = viewChildren(ProductCardComponent, {
    read: ElementRef,
  });
}
