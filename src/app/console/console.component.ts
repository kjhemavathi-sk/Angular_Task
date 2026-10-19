import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TicketService } from '../ticket.service';

@Component({
  selector: 'app-console',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent {
  readonly tickets$ = this.ticketService.tickets$;

  constructor(private readonly ticketService: TicketService) { }
}
