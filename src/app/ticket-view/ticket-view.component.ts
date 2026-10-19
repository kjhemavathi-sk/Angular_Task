import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CreateTicketInput, TicketService } from '../ticket.service';

@Component({
  selector: 'app-ticket-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css']
})
export class TicketViewComponent {
  ticket: CreateTicketInput = {
    title: '',
    description: '',
    assignee: '',
    priority: 'Medium'
  };
  submitted = false;

  constructor(
    private readonly ticketService: TicketService,
    private readonly router: Router
  ) { }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.ticketService.createTicket(this.ticket);
    this.submitted = true;
    form.resetForm({
      title: '',
      description: '',
      assignee: '',
      priority: 'Medium'
    });
  }

  viewTickets(): void {
    this.router.navigate(['/console']);
  }
}
