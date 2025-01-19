import { Injectable, signal } from '@angular/core';

interface ToastState {
  message: string;
  type: toastType;
  visible: boolean;
}

type toastType = 'info' | 'success' | 'warning' | 'error' | null;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public toastState = signal<ToastState>({
    message: '',
    type: null,
    visible: false,
  });

  showToast(message: string, type: toastType, autoClose = true) {
    this.toastState.set({ message, type, visible: true });

    if (!autoClose) return;

    setTimeout(() => {
      this.hideToast();
    }, 6000);
  }

  hideToast() {
    this.toastState.set({ message: '', type: null, visible: false });
  }
}
