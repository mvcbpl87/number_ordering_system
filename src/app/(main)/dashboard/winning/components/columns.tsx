import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

type WinningProps = {
  ticket: string;
  number: number;
  draw_date: string;
  prize: string;
  status: string;
};

// export const columns: ColumnDef<WinningProps>[] = [
//   {
//     accessorKey: "ticket",
//     header: "Ticket",
//     cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "number",
//     header: "Number",
//     cell: ({ row }) => {
//       return (
//         <div className="flex space-x-2">
//           <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
//             {row.getValue("number")}
//           </span>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "draw_date",
//     header: "Draw",
//     cell: ({ row }) => {
//       return (
//         <div className="flex w-[100px] items-center">
//           {row.getValue("draw_date")}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "prize",
//     header: "Prize",
//     cell: ({ row }) => {
//       return <div className="flex items-center">{row.getValue("prize")}</div>;
//     },
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       return <div className="flex items-center">{row.getValue("status")}</div>;
//     },
//   },
// ];

export const columns: ColumnDef<WinningOrdersWCredentials>[] = [
  {
    accessorFn: (item) => item.customer_orders?.id,
    id: "order_id",
    header: "order id",
    cell: ({ row }) => (
      <div className="font-medium text-sm text-center">
        {row.original.customer_orders?.id.substring(0,8)}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "number",
    header: "Number",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("number")}</div>;
    },
  },
  {
    accessorKey: "customer_orders.phone_number",
    header: "contacts",
    cell: ({ row }) => {
      return <div className="text-center">{row.original.customer_orders?.phone_number}</div>;
    },
  },
  {
    accessorKey: "prizes.prize_type",
    header: "prize type",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.prizes?.prize_type}
        </div>
      );
    },
  },
  {
    accessorKey: "prizes.prize_value",
    header: "prize winning",
    cell: ({ row }) => {
      const {prizes, number} = row.original;
      return (
        <div className="text-center">
          RM{" "}
          { prizes?.prize_value &&
            ( prizes.prize_value * number.length).toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "claimed",
    header: "status",
    cell: ({ row }) => {
      const { claimed } = row.original;
      return (
        <div className="text-center">
          { claimed ? "claimed" : "not claimed"}
        </div>
      );
    },
  },
];
