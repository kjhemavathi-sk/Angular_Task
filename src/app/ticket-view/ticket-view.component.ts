import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs/operators';

import { TicketService } from '../ticket.service';

@Component({
  selector: 'app-ticket-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css']
})
export class TicketViewComponent {
  readonly editMode: boolean;
  readonly ticketForm: FormGroup;
  submitted = false;
  private readonly ticketId: string | null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly ticketService: TicketService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.ticketForm = this.formBuilder.nonNullable.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      assignee: ['', Validators.required],
      priority: ['Medium', Validators.required]
    });

    this.ticketId = this.route.snapshot.paramMap.get('id');
    this.editMode = Boolean(this.ticketId);

    if (this.ticketId) {
      this.ticketService.getTicket(this.ticketId).pipe(take(1)).subscribe(ticket => {
        if (!ticket) {
          this.router.navigate(['/console']);
          return;
        }

        this.ticketForm.patchValue({
          title: ticket.title,
          description: ticket.description,
          assignee: ticket.assignee,
          priority: ticket.priority
        });
      });
    }
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    const ticket = this.ticketForm.getRawValue();

    if (this.editMode && this.ticketId) {
      this.ticketService.updateTicket(this.ticketId, ticket);
      this.submitted = true;
      return;
    }

    this.ticketService.createTicket(ticket);
    this.submitted = true;
    this.ticketForm.reset({
      title: '',
      description: '',
      assignee: '',
      priority: 'Medium'
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.ticketForm.get(controlName);
    return Boolean(control?.invalid && (control.dirty || control.touched));
  }

  viewTickets(): void {
    this.router.navigate(['/console']);
  }
}
