import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { TicketService } from '../ticket.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-console',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent {
  readonly tickets$ = this.ticketService.tickets$;

  constructor(
    private readonly ticketService: TicketService,
    private readonly toastService: ToastService,
    private readonly router: Router
  ) { }

  openTicket(id: string): void {
    this.router.navigate(['/ticket', id]);
  }

  editTicket(id: string): void {
    this.router.navigate(['/edit-ticket', id]);
  }

  deleteTicket(id: string): void {
    this.ticketService.deleteTicket(id).subscribe({
      next: () => this.toastService.show('Ticket deleted successfully.'),
      error: () => this.toastService.show('Unable to delete ticket.', 'error')
    });
  }
}
