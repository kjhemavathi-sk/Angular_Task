import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';

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
  private readonly ticketsSubject = new ReplaySubject<Ticket[]>(1);
  private readonly createdTickets: Ticket[] = [];
  private readonly deletedTicketIds = new Set<string>();
  private tickets: Ticket[] = [];

  readonly tickets$ = this.ticketsSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.fetchTickets();
  }

  getTicket(id: string): Observable<Ticket | undefined> {
    return this.tickets$.pipe(map(tickets => tickets.find(ticket => ticket.id === id)));
  }

  createTicket(input: CreateTicketInput): void {
    const ticket: Ticket = {
      id: this.getNextTicketId(),
      ...input,
      status: 'Open',
      createdDate: new Date().toISOString().slice(0, 10)
    };

    this.createdTickets.push(ticket);
    this.tickets = [...this.tickets, ticket];
    this.ticketsSubject.next(this.tickets);
  }

  updateTicket(id: string, input: CreateTicketInput): void {
    const ticketIndex = this.tickets.findIndex(ticket => ticket.id === id);

    if (ticketIndex === -1) {
      return;
    }

    const updatedTicket: Ticket = {
      ...this.tickets[ticketIndex],
      ...input
    };

    this.tickets = this.tickets.map(ticket => ticket.id === id ? updatedTicket : ticket);

    const createdTicketIndex = this.createdTickets.findIndex(ticket => ticket.id === id);
    if (createdTicketIndex !== -1) {
      this.createdTickets[createdTicketIndex] = updatedTicket;
    }

    this.ticketsSubject.next(this.tickets);
  }

  deleteTicket(id: string): void {
    this.deletedTicketIds.add(id);
    this.tickets = this.tickets.filter(ticket => ticket.id !== id);

    const createdTicketIndex = this.createdTickets.findIndex(ticket => ticket.id === id);
    if (createdTicketIndex !== -1) {
      this.createdTickets.splice(createdTicketIndex, 1);
    }

    this.ticketsSubject.next(this.tickets);
  }

  private getNextTicketId(): string {
    const highestTicketNumber = this.tickets.reduce((highest, ticket) => {
      const ticketNumber = Number(ticket.id.replace('TKT-', ''));
      return Number.isNaN(ticketNumber) ? highest : Math.max(highest, ticketNumber);
    }, 0);

    return `TKT-${String(highestTicketNumber + 1).padStart(3, '0')}`;
  }

  private fetchTickets(): void {
    this.http
      .get<Ticket[]>('assets/tickets.json')
      .pipe(delay(300))
      .subscribe({
        next: tickets => {
          this.tickets = [
            ...tickets.filter(ticket => !this.deletedTicketIds.has(ticket.id)),
            ...this.createdTickets
          ];
          this.ticketsSubject.next(this.tickets);
        },
        error: error => {
          console.error('Unable to load tickets.', error);
          this.ticketsSubject.next(this.tickets);
        }
      });
  }
}
