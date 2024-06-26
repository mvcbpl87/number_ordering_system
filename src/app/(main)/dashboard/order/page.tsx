import { currentAgent } from "@/server-actions";
import OrderUI from "./components/order-ui";
export default async function OrderPage() {
  const user = await currentAgent();
  return (
    <div className="flex flex-col flex-1 flex-grow gap-2  p-4 space-y-[1rem] md:p-6">
      <OrderUI user_id={user.id} />
    </div>
  );
}
