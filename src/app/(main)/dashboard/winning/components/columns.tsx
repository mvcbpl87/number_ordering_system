import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

type WinningProps = {
  ticket: string;
  number: number;
  draw_date: string;
  prize: string;
  status: string;
};

export const columns: ColumnDef<WinningProps>[] = [
  {
    accessorKey: "ticket",
    header: "Ticket",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "number",
    header: "Number",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("number")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "draw_date",
    header: "Draw",
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          {row.getValue("draw_date")}
        </div>
      );
    },
  },
  {
    accessorKey: "prize",
    header: "Prize",
    cell: ({ row }) => {
      return <div className="flex items-center">{row.getValue("prize")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <div className="flex items-center">{row.getValue("status")}</div>;
    },
  },
];
