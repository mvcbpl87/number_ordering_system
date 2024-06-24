"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Component() {
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Orders</CardTitle>
        <CardDescription>Recent orders from your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">User</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Com. %</TableHead>
              <TableHead>Total Com.</TableHead>
              <TableHead className="text-right">Total Sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-accent">
              <TableCell className="w-[70%]">
                <div className="font-medium">Liam Johnson</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  liam@example.com
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">Sale</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Fulfilled
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-06-23</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

type Props = {
  SubAccounts: UsersWCommission[];
  Sales: AllSales[] | null;
};
export function RecentSales({ SubAccounts, Sales }: Props) {
  const calculateTotalSales = (user_id: string) => {
    var totalSales = 0;
    if (!Sales) return totalSales;
    const salesByUser = Sales.filter((item) => item.user_id === user_id);
    console.log("salesByUser", salesByUser);
    if (salesByUser.length !== 0) {
      totalSales = salesByUser.reduce((accumulator, current) => {
        const { ticket_numbers } = current;
        const { number, category, amount } = ticket_numbers!;
        const pivot = number.length * amount * category.length;
        return (accumulator += pivot);
      }, 0);
    }
    return totalSales;
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden sm:table-cell">User</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="hidden md:table-cell">Com. %</TableHead>
          <TableHead>Total Com.</TableHead>
          <TableHead className="text-right">Total Sales</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!SubAccounts || SubAccounts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        ) : (
          SubAccounts.map((subaccount) => (
            <TableRow key={subaccount.id} className="hover:bg-accent">
              <TableCell className="">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={"/"} alt="Avatar" />
                    <AvatarFallback>
                      {subaccount.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {subaccount.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {subaccount.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className="text-xs"
                  variant={"secondary"}
                >{`${subaccount.role} Tier-${subaccount.tier}`}</Badge>
              </TableCell>
              <TableCell> {`${subaccount.commission?.percent}%`}</TableCell>
              <TableCell>
                {`RM${
                  ((subaccount.commission?.percent! / 100) *
                  calculateTotalSales(subaccount.id)).toFixed(2)
                }`}
              </TableCell>

              <TableCell className="text-right">
                {" "}
                {`RM${calculateTotalSales(subaccount.id).toFixed(2)}`}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
