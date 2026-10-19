import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { TicketService } from '../ticket.service';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent {
  readonly ticket$ = this.route.paramMap.pipe(
    switchMap(params => this.ticketService.getTicket(params.get('id') ?? ''))
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ticketService: TicketService
  ) { }
}
