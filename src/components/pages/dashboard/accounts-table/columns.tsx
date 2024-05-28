"use client";
import { Button } from "@/components/ui/button";
import { SubAccountsColumnType } from "@/lib/types";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { DeleteSubAccountAction } from "@/server-actions";
import { useToast } from "@/components/ui/use-toast";
import { IconEdit } from "@tabler/icons-react";
import { useModal } from "@/components/provider/modal-provider";
import { CustomModal } from "@/components/shared/custom-modal";
import { ManageSubAccountForm } from "@/components/form/manage-subaccount-form";

export const columns: ColumnDef<SubAccountsColumnType, any>[] = [
  {
    accessorKey: "id",
    header: "Agent Id",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <div>{id.substring(0, 8)}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;
      const user_id = data.id;
      return <ActionDropdown user_id={user_id} data={data}/>
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
  const handleEdit = () => {
    modal.setOpen(
      <CustomModal
        title="Manage Sub Account"
        subheading="Manage agent sub account to update subaccounts credentials"
      >
        <ManageSubAccountForm credentials={data} />
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
