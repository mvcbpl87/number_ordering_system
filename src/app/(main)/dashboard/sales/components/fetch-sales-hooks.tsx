import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import { RetrieveSalesOnRange } from "@/server-actions";
import { addDays } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { DateRange } from "react-day-picker";

const TotalSales = (_sales: AllSales[]) => {
  return _sales.reduce((_acc, item) => {
    let pivot: number = 0;

    const { number, amount, category } = item.ticket_numbers!;
    pivot = number.length * category.length * amount;
    return (_acc += pivot);
  }, 0);
};

/** --- Getting list of draw draws on certain date range ---- */
const dateDiffInDays = (from: Date, to: Date) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const utc2 = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

const FilterDateConstructs = (
  maxRange: number,
  date: { from: Date; to: Date }
) => {
  const listOfDates = Array.from({ length: maxRange }, (_, i) => {
    return i === 0
      ? `"${formatDate(date.from)}"`
      : `"${formatDate(addDays(date.from, i + 1))}"`;
  }).join(",");

  return `(${listOfDates})`;
};
/** --- End of Getting list of draw dates ---- */

export default function FetchSalesHooks() {
  const today = new Date();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 7),
  });
  const [creditBalance, setCreditBalance] = useState<number>(500);
  const [sales, setSales] = useState<AllSales[]>([]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setIsLoading(true);
        if (!date?.from || !date?.to) return;
        const { from, to } = date;
        const maxRange = dateDiffInDays(from, to);
        const allDrawDates = FilterDateConstructs(maxRange, { from, to });
        const data = await RetrieveSalesOnRange(allDrawDates);

        if (data) setSales(data);
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
    if (date) fetchRequest();
  }, [date]);
  const { total_paid, total_sales } = useMemo(() => {
    const hasPaid = sales.filter((item) => item.bought === true);
    const total_paid = TotalSales(hasPaid);
    const total_sales = TotalSales(sales);
    return { total_paid, total_sales };
  }, [date, sales]);
  return {
    date,
    setDate,
    sales,
    setSales,
    total_paid,
    total_sales,
    creditBalance
  };
}
