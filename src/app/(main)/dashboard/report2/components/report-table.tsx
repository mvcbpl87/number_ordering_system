import { CustomModal } from "@/components/shared/custom-modal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePreset2 } from "@/lib/game-utils/draw-date-generator/preset";
import { IconPrinter } from "@tabler/icons-react";
import ViewCustomerOrder from "./view-customer-order";
import { useModal } from "@/components/provider/modal-provider";
import {
  FilterCategory,
  FilterDrawDate,
  FilterGametype,
  TotalSales,
} from "./hooks";
type Props = {
  all_sales: AllSales[];
  category: string;
};
export default function ReportTable({ all_sales, category }: Props) {
  let TotalBig = 0;
  let TotalSmall = 0;
  let TotalSum = 0;
  const allDrawDates = new DatePreset2().GET_DRAW_DATE();
  const modal = useModal();
  const sales: AllSales[] = FilterCategory(all_sales, category);

  TotalBig = TotalSales(FilterGametype(sales, "Big"), category);
  TotalSmall = TotalSales(FilterGametype(sales, "Small"), category);
  TotalSum = TotalBig + TotalSmall;

  const viewOrderDetail = (draw_date: string) => {
    if (!category) return;
    modal.setOpen(
      <CustomModal title="Order details" subheading="All order made by agent">
        <ViewCustomerOrder
          all_sales={FilterDrawDate(sales, draw_date)}
          category={category}
        />
      </CustomModal>
    );
  };
  return (
    <div className="flex flex-col flex-grow space-y-[1rem]">
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
              const ele = sales.filter(
                (item) =>
                  item.ticket_numbers && item.ticket_numbers.draw_date === dates
              );
              const value = (gtype: string) => {
                return TotalSales(FilterGametype(ele, gtype), category);
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
                  <TableCell className="text-center w-[300px]">
                    {value("Big").toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center w-[300px]">
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
                RM
                {TotalBig.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                RM{TotalSmall.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow className=" h-[3.5rem]">
              <TableCell className="text-end sr-only ">Blank</TableCell>
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
