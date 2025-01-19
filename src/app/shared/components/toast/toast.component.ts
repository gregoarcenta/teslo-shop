import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ToastService } from '@/core/services/toast.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [NgClass],
  templateUrl: './toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  public toastState = computed(() => this.toastService.toastState());

  private readonly toastService = inject(ToastService);

  closeToast() {
    this.toastService.hideToast();
  }
}
