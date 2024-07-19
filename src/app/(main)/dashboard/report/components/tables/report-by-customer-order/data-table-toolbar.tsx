import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  updateCacheSales: (_target: AllSales[]) => void;
}

export function DataTableToolbar<TData>({
  table,
  updateCacheSales,
}: DataTableToolbarProps<TData>) {
  const handlePayout = () => {
    const _temp = table
      .getSelectedRowModel()
      .rows.map((item) => item.original) as AllSales[];
    updateCacheSales(_temp);
    table.toggleAllPageRowsSelected(false);
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Search id..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="h-9 w-[150px] lg:w-[250px]"
        />
      </div>
      <Button onClick={handlePayout}>Pay tickets</Button>
    </div>
  );
}
