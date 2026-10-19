import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

import { CreateTicketInput } from './ticket.models';
import { InMemoryTicketBackend } from './in-memory-ticket-backend.service';

@Injectable()
export class TicketApiInterceptor implements HttpInterceptor {
  constructor(private readonly backend: InMemoryTicketBackend) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith('/api/tickets')) {
      return next.handle(request);
    }

    const ticketId = request.url.split('/').filter(Boolean)[2];

    return of(null).pipe(
      delay(150),
      mergeMap(() => this.handleRequest(request, ticketId))
    );
  }

  private handleRequest(
    request: HttpRequest<unknown>,
    ticketId: string | undefined
  ): Observable<HttpEvent<unknown>> {
    switch (request.method) {
      case 'GET':
        return of(this.response(this.backend.getAll()));
      case 'POST':
        return of(this.response(this.backend.create(request.body as CreateTicketInput)));
      case 'PUT': {
        const updatedTicket = this.backend.update(ticketId ?? '', request.body as CreateTicketInput);
        return updatedTicket
          ? of(this.response(updatedTicket))
          : this.notFound(request.url);
      }
      case 'DELETE':
        return this.backend.delete(ticketId ?? '')
          ? of(this.response(null))
          : this.notFound(request.url);
      default:
        return throwError(() => new HttpErrorResponse({
          status: 405,
          statusText: 'Method not allowed',
          url: request.url
        }));
    }
  }

  private response(body: unknown): HttpResponse<unknown> {
    return new HttpResponse({ status: 200, body });
  }

  private notFound(url: string): Observable<never> {
    return throwError(() => new HttpErrorResponse({
      status: 404,
      statusText: 'Ticket not found',
      url
    }));
  }
}
