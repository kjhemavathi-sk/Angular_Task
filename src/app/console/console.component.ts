import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ticket, TicketService } from '../ticket.service';

type StatusFilter = Ticket['status'] | 'All';
type PriorityFilter = Ticket['priority'] | 'All';

@Component({
  selector: 'app-console',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent {
  private readonly statusFilterSubject = new BehaviorSubject<StatusFilter>('All');
  private readonly priorityFilterSubject = new BehaviorSubject<PriorityFilter>('All');

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

  statusFilter: StatusFilter = 'All';
  priorityFilter: PriorityFilter = 'All';

  constructor(
    private readonly ticketService: TicketService,
    private readonly router: Router
  ) { }

  onStatusFilterChange(status: StatusFilter): void {
    this.statusFilterSubject.next(status);
  }

  onPriorityFilterChange(priority: PriorityFilter): void {
    this.priorityFilterSubject.next(priority);
  }

  openTicket(id: string): void {
    this.router.navigate(['/ticket', id]);
  }

  editTicket(id: string): void {
    this.router.navigate(['/edit-ticket', id]);
  }

  deleteTicket(id: string): void {
    this.ticketService.deleteTicket(id);
  }
}
