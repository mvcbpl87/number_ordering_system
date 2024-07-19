import {
  ReduceReceiptInstanceType,
  ReduceSalesTableDataType,
} from "@/lib/types";
import { useState, useEffect, useMemo } from "react";

interface UseReportHooksProps {
  sales: AllSales[];
  credit_value: number;
  draw_dates: string[];
}

const _constants = {
  Big: "Big",
  Small: "Small",
};

export const FilterCategory = (
  sales: AllSales[],
  category: string
): AllSales[] => {
  return category === "all"
    ? sales
    : sales.filter(
        (item) =>
          item.ticket_numbers && item.ticket_numbers.category.includes(category)
      );
};

export const FilterGametype = (
  sales: AllSales[],
  gametype: string
): AllSales[] => {
  return sales.filter(
    (item) => item.ticket_numbers && item.ticket_numbers.gametype === gametype
  );
};

export const FilterDrawDate = (
  sales: AllSales[],
  draw_date: string
): AllSales[] => {
  return sales.filter(
    (item) => item.ticket_numbers && item.ticket_numbers.draw_date === draw_date
  );
};

export function CalculateReduceSales(_target: ReduceSalesTableDataType[]) {
  type OutputType = {
    total_big: number;
    total_small: number;
    total_sales: number;
  };
  const _sum = _target.reduce(
    (_acc: OutputType, item) => {
      const { total_big, total_small } = item;

      _acc.total_big += total_big;
      _acc.total_small += total_small;
      _acc.total_sales += total_big + total_small;
      return _acc;
    },
    { total_big: 0, total_small: 0, total_sales: 0 }
  );
  return _sum;
}

/* (Utils) Summations of values [sales_amount] depends on category return total_sales_amount */
export const TotalSales = (
  sales: AllSales[],
  d_category?: string | undefined
): number => {
  return sales.reduce((sum, item) => {
    let pivot = 0;
    if (item.ticket_numbers) {
      const { number, amount, category } = item.ticket_numbers;
      const EQ = number.length * amount;
      const EQ2 = number.length * amount * category.length;
      pivot = d_category !== "all" || !d_category ? EQ : EQ2;
    }
    return (sum += pivot);
  }, 0);
};

/** Reduce sales accordingly to respective draw dates **/
//prettier-ignore
function ReduceSalesByDrawDate(
  sales: AllSales[],
  draw_dates: string[],
  category: string
): ReduceSalesTableDataType[] {
  const _results: ReduceSalesTableDataType[] = draw_dates.map((draw_date) => {
    const currentSales = FilterDrawDate(sales, draw_date)
    const total_big = TotalSales(FilterGametype(currentSales, _constants.Big), category);
    const total_small = TotalSales(FilterGametype(currentSales, _constants.Small), category);
    const total_sales_per_day = total_big + total_small;
    return {
      draw_date,
      total_big,
      total_small,
      total_sales_per_day,
      raw_metadata:currentSales ,
    };
  });
  return _results;
}

function GetReceiptStats(currentDate: string | undefined, sales: AllSales[]) {
  /* Note: Category can be ignore here, since sales already filter current category upperhand */
  const sumValue = (
    tickets: TicketNumbers,
    constraints?: string | boolean | undefined
  ) => {
    const { number, amount } = tickets;
    if (!constraints) return 0;
    return number.length * amount;
  };

  let receiptInstances: ReduceReceiptInstanceType[] = [];
  if (!currentDate) return [];
  const _current = FilterDrawDate(sales, currentDate);
  receiptInstances = _current.reduce(
    (_acc: ReduceReceiptInstanceType[], data) => {
      var orders = [..._acc];
      const { receipt_id, phone_number, bought, ticket_numbers } = data;
      const findCurrent = orders.find((item) => item.receipt_id === receipt_id);

      if (findCurrent) {
        findCurrent.num_of_tickets += 1;
        findCurrent.total_sales_per_receipt += sumValue(ticket_numbers!, true);
        findCurrent.total_paid_per_receipt += sumValue(ticket_numbers!, bought);
        orders[orders.findIndex((item) => item.receipt_id === receipt_id)] ===
          findCurrent;
      } else {
        orders.push({
          receipt_id,
          phone_number,
          num_of_tickets: 1,
          total_sales_per_receipt: sumValue(ticket_numbers!, true),
          total_paid_per_receipt: sumValue(ticket_numbers!, bought),
        });
      }
      return orders;
    },
    []
  );
  return receiptInstances;
}

export default function UseReportHooks({
  sales,
  credit_value = 0,
  draw_dates,
}: UseReportHooksProps) {
  let data: ReduceSalesTableDataType[] = [];
  let receiptInstances: ReduceReceiptInstanceType[] = [];
  let orderDetails:
    | (ReduceReceiptInstanceType & { metadata: AllSales[] })
    | null = null;

  const [category, setCategory] = useState<string>("all");
  const [open, setOpen] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>();
  const [currentReceipt, setCurrentReceipt] = useState<string>();
  const [creditBalance, setCreditBalance] = useState<number>(credit_value);
  const [cacheSales, setCacheSales] = useState<AllSales[]>(sales);

  const updateCacheSales = (_target: AllSales[]) => {
    // console.log(_target.map((item) => ({ ...item, ["bought"]: !item.bought })));
    _target.forEach((item) => {
      let pivot = item.bought ? true : false;

      setCacheSales((prev) => {
        let existingData = [...prev];
        let isExist = existingData.find((ele) => ele.id === item.id);
        if (isExist) {
          existingData[existingData.findIndex((ele) => ele.id === item.id)] = {
            ...isExist,
            ["bought"]: !item.bought,
          };
        }
        return existingData;
      });
    });
  };

  const selectCell = (target_draw_date: string) => {
    setCurrentDate(target_draw_date);
    setOpen(true);
  };

  const selectReceipt = (target_receipt: string) => {
    setCurrentReceipt(target_receipt);
  };
  const currentSales = FilterCategory(cacheSales, category);
  data = useMemo(() => {
    return ReduceSalesByDrawDate(currentSales, draw_dates, category);
  }, [cacheSales, draw_dates, category]);

  receiptInstances = useMemo(() => {
    return GetReceiptStats(currentDate, currentSales);
  }, [currentDate, cacheSales, category]);

  orderDetails = useMemo(() => {
    if (!currentReceipt) return null;
    const _curr = receiptInstances.find(
      (item) => item.receipt_id === currentReceipt
    );
    if (!_curr) return null;
    return {
      ..._curr,
      metadata: currentSales.filter(
        (item) => item.receipt_id === currentReceipt
      ),
    };
  }, [currentReceipt, cacheSales, category]);

  return {
    data,
    category,
    open,
    currentReceipt,
    currentDate,
    creditBalance,
    receiptInstances,
    orderDetails,
    setCategory,
    setOpen,
    setCurrentReceipt,
    setCurrentDate,
    setCreditBalance,
    selectCell,
    selectReceipt,
    updateCacheSales,
  };
}
