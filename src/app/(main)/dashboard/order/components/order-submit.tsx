import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useOrderCacheContext from "@/hooks/use-order-cache";
import { getUniquePermutation } from "@/lib/game-utils/permutation";
import generateUUID from "@/lib/game-utils/uuid-generator";
import path from "@/lib/path";
import { InputTicketInstanceType } from "@/lib/types";
import { CreateNewCustomerOrder, CreateNewTicketOrder } from "@/server-actions";
import { IconLoader, IconTicket } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface OrderSubmitProps {
  disabled: boolean;
  metadata: InputTicketInstanceType[];
  isInCompleteList: string[];
  categories: string[];
  drawDate: string;
  user_id: string;
  phone_number: string;
}
export default function OrderSubmit({
  metadata,
  disabled,
  isInCompleteList,
  categories,
  drawDate,
  user_id,
  phone_number,
}: OrderSubmitProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const { addNewMetadata } = useOrderCacheContext();
  const CheckGametype = (
    orders: NewTicketNumbers[],
    order: NewTicketNumbers,
    pickBig: number,
    pickSmall: number
  ) => {
    if (pickBig > 0)
      orders.push({ ...order, gametype: "Big", amount: pickBig });
    if (pickSmall > 0)
      orders.push({ ...order, gametype: "Small", amount: pickSmall });
  }; // End of CheckGametype

  const CheckBoxbet = (isBoxbet: boolean, initial_number: string) => {
    let permutations: number[] = [];
    if (isBoxbet) {
      const boxbet_num = Array.from(initial_number).map((num) => Number(num));
      permutations = getUniquePermutation(boxbet_num);
      console.log(permutations);
    } else {
      permutations.push(Number(initial_number));
    }

    return { number: permutations, boxbet: isBoxbet };
  }; //End of CheckBoxBet

  const ManageOrderMetadata = () => {
    let orders: NewTicketNumbers[] = [];

    metadata.forEach((order_item) => {
      if (order_item.number === "") return; // Skip process if number is empty
      let order: NewTicketNumbers = {
        draw_date: drawDate,
        category: categories,
      };
      const { number, boxbet } = CheckBoxbet(
        order_item.boxbet,
        order_item.number
      );
      order = { ...order, number, boxbet };
      CheckGametype(orders, order, order_item.big, order_item.small);
    });
    return orders;
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (isInCompleteList.length > 0)
        throw new Error("Please complete your number before submitting.");

      /* -------- Critical Section -------- */
      const orders = ManageOrderMetadata();

      const receipt_id = generateUUID();

      /** ------ server action ------ **/
      const newTicketOrders = await CreateNewTicketOrder(orders);
      if (newTicketOrders) {
        const customerOrders: Partial<CustomerOrders>[] = newTicketOrders?.map(
          (ticket) => ({
            ticket_num_id: ticket.id,
            user_id,
            phone_number,
            receipt_id,
          })
        );
        await CreateNewCustomerOrder(customerOrders);
      }
      /** ---- end of server action ---- **/

      addNewMetadata(orders as TicketNumbers[], {
        receipt_id,
        phone_number,
        draw_date: drawDate,
        created_at: `${new Date().toLocaleString()}`,
      });
      /* ---- End of Critical Section ---- */
      toast({
        variant: "successful",
        title: "Successfully order ticker",
        description: `You have successfully order a number ticket`,
      });
      router.push(path.receipt);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      className="border flex items-center gap-2"
      disabled={disabled}
      onClick={handleSubmit}
    >
      {isLoading ? (
        <>
          <span>Submit order</span>
          <IconLoader className="animate-spin h-4 w-4" />
        </>
      ) : (
        <>
          <IconTicket className="h-4 w-4" />
          <span>Submit order</span>
          <IconTicket className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
