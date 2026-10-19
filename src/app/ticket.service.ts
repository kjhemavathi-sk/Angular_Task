import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'In Review' | 'Done';
  createdDate: string;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  assignee: string;
  priority: Ticket['priority'];
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  private readonly createdTickets: Ticket[] = [];

  readonly tickets$ = this.ticketsSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.fetchTickets();
  }

  createTicket(input: CreateTicketInput): void {
    const ticket: Ticket = {
      id: `TKT-${String(this.ticketsSubject.value.length + 1).padStart(3, '0')}`,
      ...input,
      status: 'Open',
      createdDate: new Date().toISOString().slice(0, 10)
    };

    this.createdTickets.push(ticket);
    this.ticketsSubject.next([...this.ticketsSubject.value, ticket]);
  }

  private fetchTickets(): void {
    this.http
      .get<Ticket[]>('assets/tickets.json')
      .pipe(delay(300))
      .subscribe({
        next: tickets => this.ticketsSubject.next([...tickets, ...this.createdTickets]),
        error: error => {
          console.error('Unable to load tickets.', error);
          this.ticketsSubject.next([...this.createdTickets]);
        }
      });
  }
}
