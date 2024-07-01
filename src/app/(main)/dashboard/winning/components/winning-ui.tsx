"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CategoryList } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { IconTrophy } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { IconImage } from "@/components/shared/IconImgTemplate";
import { useToast } from "@/components/ui/use-toast";
import { RetrieveWinningOrders } from "@/server-actions";

export default function WinningUI() {
  const [data, setData] = useState<WinningOrdersWCredentials[]>([]);
  const [currCategory, setCurrCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const fetchWinningOrders = async () => {
    if (!currCategory || !date) return;
    console.log("click");

    try {
      setIsLoading(true);
      const winning_orders = await RetrieveWinningOrders(
        currCategory,
        formatDate(date)
      );
      console.log(winning_orders);
      if (winning_orders) setData(winning_orders);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWinningOrders();
  }, [currCategory, date]);
  return (
    <div className=" p-4 flex flex-col flex-grow space-y-[1rem]">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span>Winning Page!</span>
          <IconTrophy />
        </h2>
        <p className="text-muted-foreground">
          Determine who&apos;s the next winner!
        </p>
      </div>
      <div className="flex items-center justify-between ">
        <ToggleGroup type="single">
          {CategoryList.map((category) => (
            <ToggleGroupItem
              value={category.name}
              key={category.name}
              onClick={() => setCurrCategory(category.name)}
              variant={"outline"}
              className={cn(
                "flex items-center gap-1 ",
                currCategory === category.name && "bg-blue-800"
              )}
            >
              <IconImage src={category.src} alt={category.alt} />
              {category.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <DataTable
        columns={columns}
        data={data}
        drawDate={date}
        setDrawDate={setDate}
        isLoading = {isLoading}
      />
    </div>
  );
}
