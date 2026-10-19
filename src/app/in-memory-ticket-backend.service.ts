import { Injectable } from '@angular/core';

import { CreateTicketInput, Ticket } from './ticket.models';

@Injectable({
  providedIn: 'root'
})
export class InMemoryTicketBackend {
  private tickets: Ticket[] = [];

  initialize(tickets: Ticket[]): void {
    if (!this.tickets.length) {
      this.tickets = [...tickets];
    }
  }

  getAll(): Ticket[] {
    return [...this.tickets];
  }

  getById(id: string): Ticket | undefined {
    return this.tickets.find(ticket => ticket.id === id);
  }

  create(input: CreateTicketInput): Ticket {
    const ticket: Ticket = {
      id: this.getNextTicketId(),
      ...input,
      status: 'Open',
      createdDate: new Date().toISOString().slice(0, 10)
    };

    this.tickets = [...this.tickets, ticket];
    return ticket;
  }

  update(id: string, input: CreateTicketInput): Ticket | undefined {
    const existingTicket = this.getById(id);
    if (!existingTicket) {
      return undefined;
    }

    const updatedTicket: Ticket = {
      ...existingTicket,
      ...input
    };

    this.tickets = this.tickets.map(ticket => ticket.id === id ? updatedTicket : ticket);
    return updatedTicket;
  }

  delete(id: string): boolean {
    const ticketExists = Boolean(this.getById(id));
    this.tickets = this.tickets.filter(ticket => ticket.id !== id);
    return ticketExists;
  }

  private getNextTicketId(): string {
    const highestTicketNumber = this.tickets.reduce((highest, ticket) => {
      const ticketNumber = Number(ticket.id.replace('TKT-', ''));
      return Number.isNaN(ticketNumber) ? highest : Math.max(highest, ticketNumber);
    }, 0);

    return `TKT-${String(highestTicketNumber + 1).padStart(3, '0')}`;
  }
}
