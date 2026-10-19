import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';

import { CreateTicketInput, Ticket } from './ticket.models';
import { InMemoryTicketBackend } from './in-memory-ticket-backend.service';

export { CreateTicketInput, Ticket } from './ticket.models';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly ticketsSubject = new ReplaySubject<Ticket[]>(1);
  private tickets: Ticket[] = [];

  readonly tickets$ = this.ticketsSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly backend: InMemoryTicketBackend
  ) {
    this.fetchTickets();
  }

  getTicket(id: string): Observable<Ticket | undefined> {
    return this.tickets$.pipe(map(tickets => tickets.find(ticket => ticket.id === id)));
  }

  createTicket(input: CreateTicketInput): Observable<Ticket> {
    return this.http.post<Ticket>('/api/tickets', input).pipe(
      tap(ticket => this.publish([...this.tickets, ticket]))
    );
  }

  updateTicket(id: string, input: CreateTicketInput): Observable<Ticket> {
    return this.http.put<Ticket>(`/api/tickets/${id}`, input).pipe(
      tap(updatedTicket => this.publish(
        this.tickets.map(ticket => ticket.id === id ? updatedTicket : ticket)
      ))
    );
  }

  deleteTicket(id: string): Observable<void> {
    return this.http.delete<void>(`/api/tickets/${id}`).pipe(
      tap(() => this.publish(this.tickets.filter(ticket => ticket.id !== id)))
    );
  }

  private fetchTickets(): void {
    this.http
      .get<Ticket[]>('assets/tickets.json')
      .pipe(
        delay(300),
        tap(tickets => this.backend.initialize(tickets)),
        switchMap(() => this.http.get<Ticket[]>('/api/tickets'))
      )
      .subscribe({
        next: tickets => this.publish(tickets),
        error: error => {
          console.error('Unable to load tickets.', error);
          this.publish([]);
        }
      });
  }

  private publish(tickets: Ticket[]): void {
    this.tickets = tickets;
    this.ticketsSubject.next(this.tickets);
  }
}
