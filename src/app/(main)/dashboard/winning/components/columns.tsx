import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { ColumnDef, Column } from "@tanstack/react-table";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

interface GetColumnDefProps {
  handleClaimed: (
    target: WinningOrdersWCredentials,
    isClaimed: boolean
  ) => void;
}
export function GetColumnDef({
  handleClaimed,
}: GetColumnDefProps) {
  const columns: ColumnDef<WinningOrdersWCredentials>[] = [
    {
      accessorFn: (item) => item.customer_orders?.id,
      id: "order_id",
      header: "order id",
      cell: ({ row }) => (
        <div className="font-medium text-sm text-center">
          {row.original.customer_orders?.id.substring(0, 6)}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "number",
      header: "number",
      cell: ({ row }) => {
        return <div className="text-center">{row.getValue("number")}</div>;
      },
    },
    {
      id: "contacts",
      accessorFn: (item) => item.customer_orders?.phone_number,
      header: "contacts",
      cell: ({ row }) => {
        return (
          <div className="text-center">
            {row.original.customer_orders?.phone_number}
          </div>
        );
      },
    },
    {
      id: "gametype",
      accessorKey: "gametype",
      header: "gametype",
      cell: ({ row }) => (
        <div className="text-center">{row.original.gametype}</div>
      ),
    },
    {
      id: "prize_type",
      accessorFn: (item) => item.prizes?.prize_type,
      header: "prize type",
      cell: ({ row }) => {
        return (
          <div className="text-center">{row.original.prizes?.prize_type}</div>
        );
      },
    },
    {
      id: "prize_winning",
      accessorFn: (item) => item.prizes?.prize_value,
      header: "prize winning",
      cell: ({ row }) => {
        const { prizes, number } = row.original;
        return (
          <div className="text-center">
            RM{" "}
            {prizes?.prize_value &&
              (prizes.prize_value * number.length).toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "claimed",
      header: "status",
      cell: ({ row }) => {
        const { claimed, deposited } = row.original;

        if (deposited)
          return (
            <div className="flex items-center justify-center">
              <Badge
                variant={"secondary"}
                className={cn(
                  "text-muted-foreground font-normal italic",
                  claimed && "bg-primary text-background "
                )}
              >
                {claimed ? "claimed" : "not claimed"}
              </Badge>
            </div>
          );

        /* If the winning prize not deposited, alert agent that the money havent deposited */
        return (
          <div className="flex items-center justify-center">
            <Badge
              variant={"secondary"}
              className="text-muted-foreground font-normal italic flex items-center gap-1"
            >
              <AlertCircleIcon size={12} /> not deposited
            </Badge>
          </div>
        );
      },
    },
    {
      id: "action",
      header: () => <div className="sr-only">Action</div>,
      cell: ({ row }) => {
        const data = row.original;
        /**
         * @Note: Action dropdown (for claim) will disabled
         * if the prize has not been deposited
         */
        return (
          <ActionDropdown
            data={data}
            handleClaimed={handleClaimed}
            disabled={!data.deposited}
          />
        );
      },
    },
  ];
  return { columns };
}

function ActionDropdown({
  data,
  handleClaimed,
  disabled = false,
}: {
  data: WinningOrdersWCredentials;
  handleClaimed: (
    target: WinningOrdersWCredentials,
    isClaimed: boolean
  ) => void;
  disabled?: boolean;
}) {
  const [isClaimed, setIsClaimed] = useState(false);

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <DotsVerticalIcon className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem className="p-0">
            <AlertDialogTrigger asChild>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="flex py-2 w-full"
                onClick={() => setIsClaimed(true)}
              >
                <span className="text-start w-full">Claimed</span>
              </Button>
            </AlertDialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <AlertDialogTrigger asChild>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="flex py-2 w-full"
                onClick={() => setIsClaimed(false)}
              >
                <span className="text-start w-full">Not Claimed</span>
              </Button>
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you wish to continue claim this ticket?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleClaimed(data, isClaimed)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
