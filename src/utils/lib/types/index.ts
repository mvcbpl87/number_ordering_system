import { z } from "zod";
export const schema = {
  customerOrder: 'customer_order',
  agentOrderTickets: 'agent_order_tickets',
  orderTickets: 'order_tickets'
}
export const LoginFormSchema = z.object({
  agentId: z.string().min(2, "required agent id").max(50),
  password: z.string().min(2, "required password").max(50),
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;

export type AgentOrderTicketsType = {
  order_id:string,
  number: number;
  boxbet:number | null;
  gametype: string;
  draw_date:string,
  amount: number;
  category:string[],
}