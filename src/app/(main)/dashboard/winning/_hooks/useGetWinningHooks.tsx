import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import { RetrieveWinningOrders, UpsertWinningPayout } from "@/server-actions";
import { useState, useEffect, useMemo } from "react";

interface UseGetWinningHooksProps {
  user_id: string;
}
const CalculateValues = (_target: WinningOrdersWCredentials[]): number => {
  return _target.reduce((acc, item) => {
    const { prize_value } = item.prizes!;
    return (acc += prize_value);
  }, 0);
};
export default function UseGetWinningHooks({
  user_id,
}: UseGetWinningHooksProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cacheData, setCacheData] = useState<WinningOrdersWCredentials[]>([]);
  const [date, setDate] = useState<Date>();
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    const fetchWinners = async () => {
      if (!category || !date) return;
      try {
        setIsLoading(true);
        const winning_orders = await RetrieveWinningOrders(
          user_id,
          formatDate(date)
        );
        if (winning_orders) return setCacheData(winning_orders);
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
    fetchWinners();
  }, [date]);

  /**
   * Handle Deposit on client side
   */
  const handleClaimed = async (
    target: WinningOrdersWCredentials,
    isClaimed: boolean
  ) => {
    try {
      var _temp = target;

      _temp.claimed = isClaimed;

      /* Critical region for update cache winning */
      const update_data = await UpsertWinningPayout(_temp);
      if (update_data) {
        var existingItems = [...cacheData];
        var ItemIndex = existingItems.findIndex(
          (currItem) =>
            currItem.customer_id === update_data.customer_id &&
            currItem.prize_id === update_data.prize_id
        );
        existingItems[ItemIndex] = update_data;
        setCacheData(existingItems);
      }
      // End of update cache winning
      toast({
        variant: "successful",
        title: "Success deposit payout",
        description: `Successfully deposit payout for order ${target.customer_orders?.id}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    }
  };

  /**
   * Data that send to client since cacheData
   * can be filtered accords. Category
   */
  const statsValue = useMemo(() => {
    return {
      totalClaimed: CalculateValues(
        cacheData.filter(
          (item) => item.claimed === true && item.deposited === true
        )
      ),
      totalSales: CalculateValues(cacheData),
    };
  }, [cacheData]);
  const data = useMemo(() => {
    if (category === "all") return cacheData;
    return cacheData.filter((item) => item.category === category);
  }, [cacheData, category]);
  return {
    isLoading,
    setIsLoading,
    data,
    date,
    setDate,
    category,
    setCategory,
    handleClaimed,
    statsValue,
  };
}
