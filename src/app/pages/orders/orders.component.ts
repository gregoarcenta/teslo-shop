import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { OrderService } from '@/core/services/order.service';
import { IOrder, OrderStatus } from '@/core/models/order';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrdersSkeletonComponent } from '@/shared/components/orders-skeleton/orders-skeleton.component';
import { OrderDetailModalComponent } from '@/shared/components/order-detail-modal/order-detail-modal.component';
import { FlowbiteService } from '@/core/services/flowbite.service';
import { initModals } from 'flowbite';

@Component({
  selector: 'app-orders',
  imports: [
    CurrencyPipe,
    DatePipe,
    OrdersSkeletonComponent,
    OrderDetailModalComponent,
  ],
  templateUrl: './orders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrdersComponent implements OnInit {
  protected readonly OrderStatus = OrderStatus;
  public orderStatusArray = signal<OrderStatus[]>(Object.values(OrderStatus));

  private readonly orderService = inject(OrderService);
  private readonly flowbiteService = inject(FlowbiteService);

  public page = signal<number>(1);
  public orders = signal<IOrder[]>([]);
  public orderInModal = signal<IOrder>({} as IOrder);
  public totalOrders = signal<number>(0);
  public isLoadingOrders = signal<boolean>(true);
  public itemsPerPage = computed(() => this.orderService.limit());
  public isLastPage = computed(
    () => this.page() * this.itemsPerPage() >= this.totalOrders(),
  );

  ngOnInit() {
    this.loadOrders(0);
  }

  loadOrders(page: number, status?: OrderStatus) {
    this.isLoadingOrders.set(true);

    this.page.update((currentPage) => currentPage + page);

    this.orderService
      .getOrders(this.page(), status)
      .subscribe(({ orders, totalOrders }) => {
        this.orders.set(orders);
        this.totalOrders.set(totalOrders);
        this.isLoadingOrders.set(false);
        this.flowbiteService.loadFlowbite(() => initModals());
      });
  }

  onOrderStatusChange(event: Event) {
    this.page.set(1);
    let selectedStatus = (event.target as HTMLSelectElement).value as
      | OrderStatus
      | '';

    this.loadOrders(0, selectedStatus || undefined);
  }
}
