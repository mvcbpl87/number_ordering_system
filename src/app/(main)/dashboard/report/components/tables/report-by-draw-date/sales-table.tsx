import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReduceSalesTableDataType } from "@/lib/types";
import { CalculateReduceSales } from "../../report-hooks";

interface SalesTableProps {
  data?: ReduceSalesTableDataType[];
  selectCell?: (target_draw_date: string) => void;
  _locales?: string;
}

export default function SalesTable({
  data,
  selectCell,
  _locales = "RM",
}: SalesTableProps) {
  const { total_big, total_small, total_sales } = CalculateReduceSales(
    data ? data : []
  );
  return (
    <div className="rounded border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className=" text-center">Draw dates</TableHead>
            <TableHead className="text-center">Big</TableHead>
            <TableHead className="text-center">Small</TableHead>
            <TableHead className="text-center">Sales per day</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            data.map((cell) => (
              <TableRow
                key={`cell-${cell.draw_date}`}
                onClick={() => {
                  if (selectCell) selectCell(cell.draw_date);
                }}
                className="h-12 cursor-pointer"
              >
                <TableCell className="text-center">{cell.draw_date}</TableCell>
                <TableCell className="text-center w-[250px]">
                  {cell.total_big.toFixed(2)}
                </TableCell>
                <TableCell className="text-center w-[250px]">
                  {cell.total_small.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  {cell.total_sales_per_day.toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow className=" h-[3.5rem]">
            <TableCell className="text-end sr-only ">Blank</TableCell>
            <TableCell className="text-center">
              {_locales}&nbsp;{total_big.toFixed(2)}
            </TableCell>
            <TableCell className="text-center">
              {_locales}&nbsp;{total_small.toFixed(2)}
            </TableCell>
            <TableCell className="text-center">
              {_locales}&nbsp;{total_sales.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
