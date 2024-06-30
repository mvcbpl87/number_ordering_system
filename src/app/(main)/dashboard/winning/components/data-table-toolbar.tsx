import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/custom/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "./date-picker";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  drawDate: Date | undefined;
  setDrawDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export function DataTableToolbar<TData>({
  table,
  drawDate,
  setDrawDate,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Search winners..."
          value={
            (table.getColumn("order_id")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("order_id")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <DatePicker date={drawDate} setDate={setDrawDate} />
      </div>
    </div>
  );
}
