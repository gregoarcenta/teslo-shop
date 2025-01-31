import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { IOrder, OrderStatus } from '@/core/models/order';
import {
  CurrencyPipe,
  DatePipe,
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-detail-modal',
  imports: [NgOptimizedImage, RouterLink, CurrencyPipe, DatePipe],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `https://res.cloudinary.com/dy7luvgd5/image/upload/v1735063243/${config.src}`;
      },
    },
  ],
  templateUrl: './order-detail-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailModalComponent {
  private readonly modalHideBtn = viewChild('modalHideBtn', {
    read: ElementRef,
  });
  public order = input.required<IOrder>();

  private readonly router = inject(Router);

  goToProductPage(slug: string): void {
    this.closeDropdown(this.modalHideBtn()!);
    this.router.navigate(['/', slug]).then(() => {});
  }

  closeDropdown(element: ElementRef) {
    document.getElementById('order-type')!.focus();
    element.nativeElement.click();
  }

  protected readonly OrderStatus = OrderStatus;
}
