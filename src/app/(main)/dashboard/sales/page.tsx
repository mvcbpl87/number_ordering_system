import { currentAgent, RetrieveAgentCredentials } from "@/server-actions";
import SalesUI from "./components/sales-ui";

export default async function SalesPage() {
  const user = await currentAgent();
  const { credits } = await RetrieveAgentCredentials(user.id);
  return (
    <div className="flex flex-col flex-1 flex-grow gap-4 bg-muted/20 p-4 md:gap-8 md:p-10">
      <SalesUI
        user_id={user.id}
        credit_value={credits ? credits.credit_value : 0}
      />
    </div>
  );
}
