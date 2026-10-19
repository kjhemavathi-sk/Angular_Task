import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="toastService.toast$ | async as toast"
      class="toast"
      [class.toast-error]="toast.type === 'error'"
      [class.toast-info]="toast.type === 'info'"
      role="alert">
      <span>{{ toast.message }}</span>
      <button type="button" aria-label="Dismiss notification" (click)="toastService.dismiss()">
        ×
      </button>
    </div>
  `,
  styles: [`
    .toast {
      align-items: center;
      background: #d1fae5;
      border-radius: 6px;
      bottom: 24px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
      color: #065f46;
      display: flex;
      gap: 16px;
      justify-content: space-between;
      left: 24px;
      max-width: calc(100vw - 48px);
      padding: 14px 16px;
      position: fixed;
      z-index: 1000;
    }

    .toast-error {
      background: #fde8e8;
      color: #a93226;
    }

    .toast-info {
      background: #dbeafe;
      color: #1d4ed8;
    }

    button {
      background: transparent;
      border: 0;
      color: inherit;
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
      padding: 0;
    }

    @media (max-width: 600px) {
      .toast {
        bottom: 16px;
        left: 16px;
        max-width: calc(100vw - 32px);
      }
    }
  `]
})
export class ToastComponent {
  constructor(readonly toastService: ToastService) { }
}
