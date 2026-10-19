import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Ticket } from '../ticket.models';

export type StatusFilter = Ticket['status'] | 'All';
export type PriorityFilter = Ticket['priority'] | 'All';

@Component({
  selector: 'app-ticket-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-filters.component.html',
  styleUrls: ['./ticket-filters.component.css']
})
export class TicketFiltersComponent {
  @Input() statuses: Ticket['status'][] = [];
  @Input() priorities: Ticket['priority'][] = [];
  @Input() statusFilter: StatusFilter = 'All';
  @Input() priorityFilter: PriorityFilter = 'All';

  @Output() statusFilterChange = new EventEmitter<StatusFilter>();
  @Output() priorityFilterChange = new EventEmitter<PriorityFilter>();

  onStatusFilterChange(status: StatusFilter): void {
    this.statusFilterChange.emit(status);
  }

  onPriorityFilterChange(priority: PriorityFilter): void {
    this.priorityFilterChange.emit(priority);
  }
}
