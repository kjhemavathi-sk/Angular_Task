import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConsoleComponent } from './console/console.component';
import { TicketViewComponent } from './ticket-view/ticket-view.component';

export const routes: Routes = [
  { path: 'console', component: ConsoleComponent },
  { path: 'create-ticket', component: TicketViewComponent },
  { path: '', redirectTo: 'console', pathMatch: 'full' },
  { path: '**', redirectTo: 'console' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
