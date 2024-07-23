import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<AllSales>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "id",
    accessorFn: (key) => key.id,
    header: "id",
    cell: ({ row }) => (
      <div className="text-center">{row.original.id.substring(0, 5)}</div>
    ),
  },
  {
    id: "number",
    accessorFn: (key) => key.ticket_numbers?.number,
    header: "number",
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.ticket_numbers?.number[0]}
      </div>
    ),
  },
  {
    id: "boxbet",
    accessorFn: (key) => key.ticket_numbers?.boxbet,
    header: "boxbet",
    cell: ({ row }) => {
      const { boxbet } = row.original.ticket_numbers!;
      return <div className="text-center">{!boxbet ? "none" : "box"}</div>;
    },
  },
  {
    id: "gametype",
    accessorFn: (key) => key.ticket_numbers?.gametype,
    header: "gametype",
    cell: ({ row }) => (
      <div className="text-center">{row.original.ticket_numbers?.gametype}</div>
    ),
  },
  {
    id: "status",
    accessorKey: "bought",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 "
        >
          status
          <ArrowUpDown size={15} className="ml-2"/>
        </Button>
      );
    },
    cell: ({ row }) => {
      const { bought } = row.original;
      return <div className="text-center ">{bought ? "paid" : "not paid"}</div>;
    },
  },
  {
    id: "amount",
    header: "amount",
    cell: ({ row }) => {
      const { number, amount, category } = row.original.ticket_numbers!;
      return (
        <div className="text-center ">
          RM&nbsp;{(number.length * amount * category.length).toFixed(2)}
        </div>
      );
    },
  },
  
];
