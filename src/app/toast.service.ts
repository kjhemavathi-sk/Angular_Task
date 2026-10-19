import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastSubject = new BehaviorSubject<Toast | null>(null);
  private dismissTimer: ReturnType<typeof setTimeout> | undefined;

  readonly toast$ = this.toastSubject.asObservable();

  show(message: string, type: ToastType = 'success'): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
    }

    this.toastSubject.next({ message, type });
    this.dismissTimer = setTimeout(() => this.dismiss(), 3500);
  }

  dismiss(): void {
    this.toastSubject.next(null);
  }
}
