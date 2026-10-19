import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  PriorityFilter,
  StatusFilter,
  TicketFiltersComponent
} from '../ticket-filters/ticket-filters.component';
import { Ticket, TicketService } from '../ticket.service';
import { ToastService } from '../toast.service';

type ConsoleStatusFilter = StatusFilter;
type ConsolePriorityFilter = PriorityFilter;

@Component({
  selector: 'app-console',
  standalone: true,
  imports: [CommonModule, RouterLink, TicketFiltersComponent],
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent {
  private readonly statusFilterSubject = new BehaviorSubject<ConsoleStatusFilter>('All');
  private readonly priorityFilterSubject = new BehaviorSubject<ConsolePriorityFilter>('All');

  readonly statuses: Ticket['status'][] = ['Open', 'In Progress', 'In Review', 'Done'];
  readonly priorities: Ticket['priority'][] = ['Low', 'Medium', 'High'];
  readonly tickets$ = this.ticketService.tickets$;
  readonly filteredTickets$ = combineLatest([
    this.tickets$,
    this.statusFilterSubject,
    this.priorityFilterSubject
  ]).pipe(
    map(([tickets, status, priority]) => tickets.filter(ticket =>
      (status === 'All' || ticket.status === status) &&
      (priority === 'All' || ticket.priority === priority)
    ))
  );

  statusFilter: ConsoleStatusFilter = 'All';
  priorityFilter: ConsolePriorityFilter = 'All';

  constructor(
    private readonly ticketService: TicketService,
    private readonly toastService: ToastService,
    private readonly router: Router
  ) { }

  onStatusFilterChange(status: ConsoleStatusFilter): void {
    this.statusFilter = status;
    this.statusFilterSubject.next(status);
  }

  onPriorityFilterChange(priority: ConsolePriorityFilter): void {
    this.priorityFilter = priority;
    this.priorityFilterSubject.next(priority);
  }

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
