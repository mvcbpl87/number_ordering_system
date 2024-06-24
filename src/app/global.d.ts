import { Database as DB } from "../../schema/database.types";

declare global {
  type Database = DB;
  type Users = Database["public"]["Tables"]["users"]["Row"];
  type CustomerOrders = Database["public"]["Tables"]["customer_orders"]["Row"];
  type TicketNumbers = Database["public"]["Tables"]["ticket_numbers"]["Row"];
  type Commission = Database["public"]["Tables"]["commission"]["Row"];
  type RootCommission = Database["public"]["Tables"]["root_commission"]["Row"];

  /* ----- Custom Type Exports ----- */
  type UsersWCommission = Users & { commission: Commission | null };
  type NewTicketNumbers = Partial<
    Database["public"]["Tables"]["ticket_numbers"]["Row"]
  >;
  type AllSales = CustomerOrders & {
    ticket_numbers: TicketNumbers | null;
  };
  type AllSubAccounts = {
    id: Users["id"];
    username: Users["username"];
    email: Users["email"];
    role: Users["role"];
  }[];
}
