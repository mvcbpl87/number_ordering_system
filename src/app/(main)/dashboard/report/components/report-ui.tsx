"use client";
import { IconImage } from "@/components/shared/IconImgTemplate";
import UseReportHooks from "./report-hooks";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryList } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import {
  IconCashBanknote,
  IconCoinBitcoinFilled,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import ReportByDrawDate from "./tables/report-by-draw-date";
import ReportByCustomerOrder from "./tables/report-by-customer-order";

function ControlsSelection({
  category,
  setCategory,
}: {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex gap-2">
      <div className="grid gap-3 ">
        <Label htmlFor="status" className="font-semibold">
          Category
        </Label>
        <Select defaultValue={category} onValueChange={setCategory}>
          <SelectTrigger
            id="status"
            aria-label="Select shop category"
            className="w-[200px] bg-background select-none"
          >
            <SelectValue placeholder="Select shop category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"} onClick={() => setCategory("all")}>
              <span className="flex items-center justify-center gap-2 py-2 text-center text-xs">
                All Categories
              </span>
            </SelectItem>
            {CategoryList.map((category) => (
              <SelectItem
                value={category.name}
                key={category.name}
                onClick={() => setCategory(category.name)}
              >
                <div className="flex items-center gap-2 py-2 text-xs">
                  <IconImage src={category.src} alt={category.alt} />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

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
      <Progress className="h-1" value={(total_paid / total_paid) * 100} />
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

interface ReportUIProps {
  sales: AllSales[];
  draw_dates: string[];
  credit_value: number;
}

export default function ReportUI({
  sales,
  draw_dates,
  credit_value,
}: ReportUIProps) {
  const {
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
    selectCell,
    selectReceipt,
    updateCacheSales,
  } = UseReportHooks({ sales, draw_dates, credit_value });

  return (
    <div className="grid gap-[1rem]">
      <ControlsSelection category={category} setCategory={setCategory} />
      <div className="flex gap-2 items-center">
        <SaleStats />
        <CreditBalance credit_value={creditBalance} />
      </div>
      <ReportByDrawDate data={data} selectCell={selectCell} />
      {currentDate && (
        <ReportByCustomerOrder
          open={open}
          setOpen={setOpen}
          creditBalance={creditBalance}
          receiptInstances={receiptInstances}
          currentReceipt={currentReceipt}
          selectReceipt={selectReceipt}
          orderDetails={orderDetails}
          updateCacheSales={updateCacheSales}
        />
      )}
    </div>
  );
}
