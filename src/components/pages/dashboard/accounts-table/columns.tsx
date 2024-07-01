"use client";
import { Button } from "@/components/ui/button";
import { SubAccountsColumnType } from "@/lib/types";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Trash } from "lucide-react";
import { DeleteSubAccountAction, currentAgent, currentUserRoleTier } from "@/server-actions";
import { useToast } from "@/components/ui/use-toast";
import { IconEdit } from "@tabler/icons-react";
import { useModal } from "@/components/provider/modal-provider";
import { CustomModal } from "@/components/shared/custom-modal";
import { ManageSubAccountForm } from "@/components/form/manage-subaccount-form";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<SubAccountsColumnType, any>[] = [
  {
    accessorKey: "email",
    header: "users",
    cell: ({ row }) => {
      const { username, email } = row.original;
      return (
        <div className="flex flex-col gap-2 items-center text-start">
          <div>{username}</div>
          <div>{email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "commission",
    header: "commission rate (%)",
    cell: ({ row }) => (
      <div className="text-center">{`${row.original.commission?.percent}%`}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const { role, tier } = row.original;
      return (
        <div className="flex items-center justify-center">
          <Badge variant={"secondary"}>{`${role} Tier-${tier}`}</Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;
      const user_id = data.id;
      return <ActionDropdown user_id={user_id} data={data} />;
    },
  },
];

function ActionDropdown({
  user_id,
  data,
}: {
  user_id: string;
  data: SubAccountsColumnType;
}) {
  const modal = useModal();
  const { toast } = useToast();

  const handleClick = async () => {
    try {
      await DeleteSubAccountAction(user_id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    }
  };
  const handleEdit = async() => {
    const user = await currentAgent();
    const parent_agent = await currentUserRoleTier(user.id);
    modal.setOpen(
      <CustomModal
        title="Manage Sub Account"
        subheading="Manage agent sub account to update subaccounts credentials"
      >
        <ManageSubAccountForm credentials={data} parent_comm_rate={parent_agent?.commission!}/>
      </CustomModal>
    );
  };
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"}>
            <DotsVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <AlertDialogTrigger className="flex items-center gap-1 text-destructive">
              <Trash size={15} />
              Delete
            </AlertDialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-1"
            onClick={handleEdit}
          >
            <IconEdit size={15} />
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
