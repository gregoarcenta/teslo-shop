import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-products-skeleton',
  imports: [],
  templateUrl: './products-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsSkeletonComponent {}
