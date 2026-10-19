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
