import { AgentOrderTicketsType, schema } from "@/utils/lib/types";
import { supabase } from "@/utils/supabase/spbClient";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, LucideMoveLeft, MoveRight, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  draw_date: string;
  all_sales: AllSales[];
  category: string | null;
};
type CustomerOrderType = {
  phone_number: string;
  order_id: string;
  value: number;
};

export default function ViewCustomerOrder({
  category,
  draw_date,
  all_sales,
}: Props) {
  // const [customerOrder, setCustomerOrder] = useState<CustomerOrderType[]>([]);
  // const [orderDetails, setOrderDetails] = useState<AgentOrderTicketsType[]>([]);
  const [currentView, setCurrentView] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const viewOrderDetails = (order_id: string) => {
    setCurrentView(order_id);
  };
  const customerOrder = all_sales.filter(
    (item) =>
      item.ticket_numbers.draw_date === draw_date &&
      item.ticket_numbers.category.includes(category!)
  );
  const TotalValue = customerOrder.reduce((sum, item) => {
    const { number, amount } = item.ticket_numbers;
    const pivot = number.length * amount;
    return (sum += pivot);
  }, 0);
  const TotalTicketValue = (currentView: string) => {
    return customerOrder
      .filter((order) => order.ticket_num_id === currentView)
      .reduce((sum, item) => {
        const { number, amount } = item.ticket_numbers;
        const pivot = number.length * amount;
        return (sum += pivot);
      }, 0);
  };
  if (currentView)
    return (
      <div className="space-y-[1rem]">
        <Button
          className="flex items-center gap-2"
          size={"sm"}
          onClick={() => setCurrentView(null)}
        >
          <LucideMoveLeft size={15} /> Back
        </Button>
        <Table className="border w-[540px]">
          <TableCaption>A list of number details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Receipt Id</TableHead>
              <TableHead className="text-center">Number</TableHead>
              <TableHead className="text-center">Boxbet</TableHead>
              <TableHead className="text-center">Gametype</TableHead>
              <TableHead className="text-center">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerOrder.length !== 0 ? (
              customerOrder
                .filter((order) => order.ticket_num_id === currentView)
                .map((order, index) => (
                  <TableRow key={`orderDetailsRow-${index + 1}`}>
                    <TableCell className="font-medium text-center">
                      {order.ticket_num_id.substring(0, 8)}
                    </TableCell>
                    <TableCell className=" text-center">
                      {order.ticket_numbers.number[0]}
                    </TableCell>
                    <TableCell className="text-center">
                      {!order.ticket_numbers.boxbet ? "None" : "Box"}
                    </TableCell>
                    <TableCell className="text-center">
                      {order.ticket_numbers.gametype}
                    </TableCell>
                    <TableCell className="text-center">
                      {order.ticket_numbers.amount *
                        order.ticket_numbers.number.length}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="h-[3.5rem] text-end">
                Total value
              </TableCell>
              <TableCell className="text-center">
                RM{TotalTicketValue(currentView).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  return (
    <Table className="border w-[540px]">
      <TableCaption>A list of customer orders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">order Id</TableHead>
          <TableHead className="text-center">Phone numbers</TableHead>
          <TableHead className="text-center">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={3} className="h-24 ">
              <div className=" flex items-center justify-center">
                <Loader2 className="animate-spin" />
              </div>
            </TableCell>
          </TableRow>
        ) : customerOrder.length !== 0 ? (
          customerOrder.map((order) => (
            <TableRow
              key={order.ticket_num_id}
              onClick={() => viewOrderDetails(order.ticket_num_id)}
            >
              <TableCell className="font-medium text-center">
                {order.id.substring(0, 8)}
              </TableCell>
              <TableCell className="text-center">
                {order.phone_number}
              </TableCell>
              <TableCell className="text-center">
                {order.ticket_numbers.amount *
                  order.ticket_numbers.number.length}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2} className="h-[3.5rem] text-end">
            Total value
          </TableCell>
          <TableCell className="text-center">
            RM{TotalValue.toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
