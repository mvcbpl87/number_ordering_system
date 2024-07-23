"use client";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "./date-picker-range";
import { DateRange } from "react-day-picker";
import {
  IconCashBanknote,
  IconCoinBitcoinFilled,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { Progress } from "@/components/ui/progress";
import SalesDataTable from "./data-table-sales";
import FetchSalesHooks from "./fetch-sales-hooks";
type SaleStatsValueType = {
  value: number;
  label: string;
  icon: React.ElementType;
};

function SaleStats({
  total_sales = 0,
  total_paid = 0,
}: {
  total_sales?: number;
  total_paid?: number;
}) {
  const values: SaleStatsValueType[] = [
    {
      value: total_sales,
      label: "Total Sales",
      icon: IconCurrencyDollar,
    },
    {
      value: total_paid,
      label: "Total Paid",
      icon: IconCashBanknote,
    },
  ];
  return (
    <div className="grid w-[220px] shadow py-3 px-4 gap-2 rounded bg-card border-l-4 border-primary">
      {values.map((item) => (
        <div key={`stat-key-${item.label}`} className="flex items-center gap-2">
          <item.icon className="h-4 w-4" />
          <span className="text-xs font-medium">{item.label}&nbsp;:</span>
          <span className="text-xs font-medium">RM{item.value.toFixed(2)}</span>
        </div>
      ))}
      <Progress className="h-1" value={(total_paid / total_sales) * 100} />
    </div>
  );
}

function CreditBalance({
  credit_value = 0,
  _locale = "RM",
}: {
  credit_value?: number;
  _locale?: string;
}) {
  return (
    <div className="grid w-[140px] shadow py-3 px-4 gap-2 rounded bg-card border-l-4 border-yellow-500 primary  h-full">
      <div className="flex items-center gap-2 [&>svg]:text-yellow-500">
        <IconCoinBitcoinFilled className="h-4 w-4" />
        <span className="text-xs font-medium">Balance</span>
      </div>
      <span className="font-medium">
        {_locale}&nbsp;{credit_value.toFixed(2)}
      </span>
    </div>
  );
}

interface ControlsSelectionProps {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

function ControlsSelection({ date, setDate }: ControlsSelectionProps) {
  return (
    <div className="flex gap-2">
      <div className="grid gap-3">
        <Label htmlFor="draw_date" className="font-semibold">
          Draw dates
        </Label>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>
    </div>
  );
}
export default function SalesUI() {
  const { date, setDate, sales, total_paid, total_sales, creditBalance } = FetchSalesHooks();
  return (
    <div className="grid gap-[1rem]">
      <ControlsSelection date={date} setDate={setDate} />
      <div className="flex gap-2 items-center">
        <SaleStats total_paid={total_paid} total_sales={total_sales}/>
        <CreditBalance credit_value={creditBalance} />
      </div>
      <SalesDataTable data={sales} />
    </div>
  );
}
