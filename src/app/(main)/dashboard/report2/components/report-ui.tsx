"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CategoryList } from "@/lib/types";
import { IconImage } from "@/components/shared/IconImgTemplate";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CardSales from "@/components/pages/dashboard/card-sales";
import { IconCurrencyDollar, IconPrinter } from "@tabler/icons-react";
import ReportTable from "./report-table";
import { Button } from "@/components/ui/button";

type Props = {
  user_id: string;
  total_sales: number;
  all_sales: AllSales[];
};
export default function ReportUI({ user_id, total_sales, all_sales }: Props) {
  const [currCategory, setCurrCategory] = useState<string>("all");
  return (
    <div className=" p-4 flex flex-col flex-grow space-y-[1rem]">
      <div className="grid grid-cols-4 ">
        <CardSales
          title="Total Sales"
          icon={IconCurrencyDollar}
          type="currency"
          value={total_sales}
          descriptions=""
        />
      </div>

      <div className="flex items-center justify-between ">
        <ToggleGroup type="single" defaultValue="all">
          <ToggleGroupItem
            value={"all"}
            variant={"outline"}
            onClick={() => setCurrCategory("all")}
            className={cn(
              currCategory === "all" &&
                "data-[state=on]:bg-primary data-[state=on]:text-background"
            )}
          >
            All categories
          </ToggleGroupItem>
          {CategoryList.map((category) => (
            <ToggleGroupItem
              value={category.name}
              key={category.name}
              onClick={() => setCurrCategory(category.name)}
              variant={"outline"}
              className={cn(
                "flex items-center gap-1 ",
                currCategory === category.name &&
                  "data-[state=on]:bg-primary data-[state=on]:text-background"
              )}
            >
              <IconImage src={category.src} alt={category.alt} />
              {category.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div>
          <Button className="flex items-center gap-1" >
            <IconPrinter size={15} />
            Download Report
          </Button>
        </div>
      </div>
      <ReportTable all_sales={all_sales} category={currCategory} />
    </div>
  );
}
