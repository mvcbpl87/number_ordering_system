"use client";
import { IconTicket } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { TicketOrders, TicketOrdersDispatch } from "@/lib/types";
import { CategoryList } from "@/lib/types";
import generateUUID from "@/utils/uuid-generator";
import {
  amt_temp,
  boxbet_temp,
  num_temp,
  sequence,
} from "@/components/shared/template";
import { getUniquePermutation } from "@/utils/lib/permutation/boxbet";
import { useToast } from "@/components/ui/use-toast";
import { CreateNewCustomerOrder, CreateNewTicketOrder } from "@/server-actions";
import useOrderCacheContext from "@/hooks/use-order-cache";
import { useRouter } from "next/navigation";
type Props = {
  metadata: TicketOrders;
  state: TicketOrdersDispatch;
};
export default function SubmitButton({ metadata, state }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const { addNewMetadata } = useOrderCacheContext();
  const CheckError = (
    /*Check error if no defined category and number input */
    category: string[], // Required lottery category
    number: number, // Required lottery number
    phoneNum: string
  ) => {
    if (!phoneNum)
      throw new Error(
        "No contact number provided. Please insert contact number"
      );
    if (category.length <= 0 && number == 0)
      throw new Error("Missing required information");
    else if (category.length <= 0) throw new Error("Please select category");
    else if (number === 0) throw new Error("Please insert number");
  };
  const Reset = () => {
    const { setNumber, setBoxbet, setBig, setSmall, setPhoneNum } = state;
    setNumber(num_temp);
    setBoxbet(boxbet_temp);
    setBig(amt_temp);
    setSmall(amt_temp);
  };
  const DefineCategory = () => {
    let result = [];
    for (let category of CategoryList) {
      if (metadata.category[category.name]) result.push(category.name);
    }
    return result;
  };
  const CheckBoxbet = (isBoxbet: boolean, initial_number: string[]) => {
    const number = Number(initial_number.join(""));
    let permutations: number[] = [];
    let boxbet = false;
    if (isBoxbet) {
      permutations = getUniquePermutation(initial_number).filter(
        (num) => !metadata.sold_out.includes(num)
      );
      console.log(permutations);
      boxbet = true;
    } else {
      permutations.push(number);
    }

    return { number: permutations, boxbet };
  };
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
  };

  const onSubmit = async () => {
    let orders: NewTicketNumbers[] = [];
    let order_id = null;
    try {
      /** Initiating ticket number creation */
      const category = DefineCategory();

      /* !! Restrict, must have at least one number to submit */
      const init_seq = sequence[0];
      const init_num = Number(metadata.number[init_seq].join(""));
      CheckError(category, init_num, metadata.phone_num);

      for (let i in sequence) {
        let order: NewTicketNumbers = {
          draw_date: metadata.draw_date,
          category,
        };
        const target = sequence[i];
        const initial_number = metadata.number[target];

        const pickBig = Number(metadata.big[target]);
        const pickSmall = Number(metadata.small[target]);
        const isBoxbet = metadata.boxbet[target];
        const { number, boxbet } = CheckBoxbet(isBoxbet, initial_number);
        order = { ...order, number, boxbet };
        CheckGametype(orders, order, pickBig, pickSmall);
      }

      // Comment for a bit
        const receipt_id = generateUUID();
        const newTicketOrders = await CreateNewTicketOrder(orders);
        if (newTicketOrders) {
          const customerOrders: Partial<CustomerOrders>[] = newTicketOrders?.map(
            (ticket) => ({
              ticket_num_id: ticket.id,
              user_id: metadata.user_id,
              phone_number: metadata.phone_num,
              receipt_id
            })
          );
          await CreateNewCustomerOrder(customerOrders)
        }
      addNewMetadata(orders as TicketNumbers[], {
        receipt_id,
        phone_number: metadata.phone_num,
        draw_date: metadata.draw_date,
        created_at: `${new Date().toLocaleString()}`,
      });
      console.log("click", orders);

      /* Successful Feedback Toast */
      toast({
        variant: "successful",
        title: "Successfully purchase ticket",
        description: `You have successfully purchase a ticket ${order_id}`,
      });
      Reset();
      router.push("/order/receipt");
    } catch (error) {
      console.log(error);

      /** Destructive Feedback Toast */
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    }
  };

  return (
    <div className=" flex items-center justify-center">
      <Button
        onClick={onSubmit}
        className="flex items-center gap-2"
        size={"lg"}
      >
        <IconTicket /> Buy Ticket <IconTicket />
      </Button>
    </div>
  );
}
