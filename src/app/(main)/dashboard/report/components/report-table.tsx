import { CustomModal } from "@/components/shared/custom-modal";
import { Button } from "@/components/ui/button";
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
import { shopType } from "@/lib/types";
import { DatePreset } from "@/utils/draw-date-generator";
import { IconPrinter } from "@tabler/icons-react";
import ViewCustomerOrder from "./view-customer-order";
import { useModal } from "@/components/provider/modal-provider";
type Props = {
  all_sales: AllSales[];
  category: string | null;
};
export default function ReportTable({ all_sales, category }: Props) {
  const allDrawDates = new DatePreset().GET_DRAW_DATE();
  const modal = useModal();
  const TotalBig = all_sales
    .filter(
      (item) =>
        item.ticket_numbers &&
        item.ticket_numbers!.gametype === "Big" &&
        item.ticket_numbers.category.includes(category!)
    )
    .reduce((sum, item) => {
      let pivot = 0;
      if (item.ticket_numbers) {
        const { number, amount } = item.ticket_numbers;
        pivot = number.length * amount;
      }
      return (sum += pivot);
    }, 0);
  const TotalSmall = all_sales
    .filter(
      (item) =>
        item.ticket_numbers &&
        item.ticket_numbers.gametype === "Small" &&
        item.ticket_numbers.category.includes(category!)
    )
    .reduce((sum, item) => {
      let pivot = 0;
      if (item.ticket_numbers) {
        const { number, amount } = item.ticket_numbers;
        pivot = number.length * amount;
      }
      return (sum += pivot);
    }, 0);
  const TotalSum = TotalBig + TotalSmall;

  const viewOrderDetail = (draw_date: string) => {
    if (!category) return;
    modal.setOpen(
      <CustomModal title="Order details" subheading="All order made by agent">
        <ViewCustomerOrder
          all_sales={all_sales}
          draw_date={draw_date}
          category={category}
        />
      </CustomModal>
    );
  };
  return (
    <div className="flex flex-col flex-grow space-y-[1rem]">
      <div>
        <Button className="flex items-center">
          <IconPrinter size={15} />
          Download Report
        </Button>
      </div>
      <div className="border rounded h-full flex flex-grow flex-col">
        <Table className="  ">
          <TableHeader>
            <TableRow>
              <TableHead className=" text-center">Draw date</TableHead>
              <TableHead className="text-center">Big</TableHead>
              <TableHead className="text-center">Small</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {allDrawDates.map((dates) => {
              const ele = all_sales.filter(
                (item) =>
                  item.ticket_numbers &&
                  item.ticket_numbers.draw_date === dates &&
                  item.ticket_numbers.category.includes(category!)
              );
              const value = (gtype: string) => {
                const array = ele.filter(
                  (item) =>
                    item.ticket_numbers &&
                    item.ticket_numbers.gametype === gtype
                );
                return array.reduce((sum, item) => {
                  let pivot = 0;
                  if (item.ticket_numbers) {
                    const { number, amount } = item.ticket_numbers;
                    pivot = number.length * amount;
                  }
                  return (sum += pivot);
                }, 0);
              };
              return (
                <TableRow
                  key={dates}
                  className="text-md my-4 h-16 cursor-pointer"
                  onClick={() => viewOrderDetail(dates)}
                >
                  <TableCell className="font-medium text-center">
                    {dates}
                  </TableCell>
                  <TableCell className="text-center">
                    {value("Big").toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {value("Small").toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-white h-[3.5rem]">
              <TableCell className="text-end ">{null}</TableCell>
              <TableCell className="text-center ">
                RM{TotalBig.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                RM{TotalSmall.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow className=" h-[3.5rem]">
              <TableCell className="text-end ">{null}</TableCell>
              <TableCell className="text-center">Total</TableCell>
              <TableCell className="text-center">
                RM{TotalSum.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
