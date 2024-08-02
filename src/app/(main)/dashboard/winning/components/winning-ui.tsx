"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CategoryList } from "@/lib/types";
import { IconCurrencyDollar, IconTrophy } from "@tabler/icons-react";
import { DataTable } from "./data-table";
import { IconImage } from "@/components/shared/IconImgTemplate";
import UseGetWinningHooks from "../_hooks/useGetWinningHooks";
import { GetColumnDef } from "./columns";
import { Progress } from "@/components/ui/progress";

function SaleStats({
  total_sales = 0,
  total_claimed = 0,
  locales = "RM",
}: {
  total_sales?: number;
  total_claimed?: number;
  locales?: string;
}) {
  return (
    <div className="grid w-[280px] shadow py-3 px-4 gap-2 rounded bg-card border-l-4 border-primary">
      <div className="flex items-center justify-between gap-2">
        <IconCurrencyDollar className="h-4 w-4" />
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium">Total claimed :</span>
          <span className="text-xs font-medium">
            {locales}
            {total_claimed.toFixed(2)}&nbsp;/
          </span>
          <span className="text-xs font-medium">{total_sales.toFixed(2)}</span>
        </div>
      </div>

      <Progress className="h-1" value={(total_claimed / total_sales) * 100} />
    </div>
  );
}
export default function WinningUI({ user_id }: { user_id: string }) {
  const {
    isLoading,
    data,
    category,
    setCategory,
    date,
    setDate,
    handleClaimed,
    statsValue
  } = UseGetWinningHooks({ user_id });

  const { columns } = GetColumnDef({ handleClaimed });
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
        <ToggleGroup type="single" defaultValue={category}>
          <ToggleGroupItem
            value={"all"}
            onClick={() => setCategory("all")}
            variant={"outline"}
            className="flex items-center gap-1 data-[state=on]:bg-primary data-[state=on]:text-background"
          >
            All Categories
          </ToggleGroupItem>
          {CategoryList.map((cate) => (
            <ToggleGroupItem
              value={cate.name}
              key={cate.name}
              onClick={() => setCategory(cate.name)}
              variant={"outline"}
              className="flex items-center gap-1 data-[state=on]:bg-primary data-[state=on]:text-background"
            >
              <IconImage src={cate.src} alt={cate.alt} />
              {cate.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <SaleStats total_claimed={statsValue.totalClaimed} total_sales={statsValue.totalSales} />
      <DataTable
        columns={columns}
        data={data}
        drawDate={date}
        setDrawDate={setDate}
        isLoading={isLoading}
      />
    </div>
  );
}
