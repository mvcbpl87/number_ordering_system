"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RetrieveAllSales } from "@/server-actions";
import { IconLoader } from "@tabler/icons-react";
import { useEffect, useState } from "react";
type RowTemplateProps = {
  id: string;
  src: string;
  email: string;
  username: string;
};

function RowTemplate({ src, email, username, id }: RowTemplateProps) {
  const [sales, setSales] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const allSales = await RetrieveAllSales(id);
      const monthlySales = allSales?.reduce((accumulator, current) => {
        const { ticket_numbers } = current;
        const { number, category, amount } = ticket_numbers!;
        const pivot = number.length * amount * category.length;
        return (accumulator += pivot);
      }, 0);
      if (!monthlySales) return;
      setSales(monthlySales);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {fetchSales()}, [id]);
  return (
    <div className="flex items-center">
      <Avatar className="h-9 w-9">
        <AvatarImage src={src} alt="Avatar" />
        <AvatarFallback>{email.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{username}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
      <div className="ml-auto font-medium">
        {isLoading ? (
          <IconLoader size={15} className="animate-spin" />
        ) : (
          `RM${!sales ? 0: sales.toFixed(2)}`
        )}
      </div>
    </div>
  );
}

type Props = {
  SubAccounts: AllSubAccounts;
};
export function RecentSales({ SubAccounts }: Props) {
  return (
    <div className="space-y-8">
      {SubAccounts.map((subaccount) => (
        <RowTemplate
          key={subaccount.id}
          src="/"
          email={`${subaccount.email}`}
          username={`${subaccount.username}`}
          id={subaccount.id}
        />
      ))}
    </div>
  );
}
