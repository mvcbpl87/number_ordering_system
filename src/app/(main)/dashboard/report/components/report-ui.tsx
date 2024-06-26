"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CategoryList } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CardSales from "@/components/pages/dashboard/card-sales";
import { IconCurrencyDollar } from "@tabler/icons-react";
import ReportTable from "./report-table";

const Icon = ({ alt, src }: { alt?: string; src?: string }) => {
  const style = `rounded-lg w-6 h-6 relative`;
  const img = "rounded-full border border-black/20";
  if (!alt || !src) return;
  return (
    <div className={style}>
      <Image
        fill
        priority
        className={img}
        alt={alt}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "contain" }}
        src={src}
      />
    </div>
  );
};
type Props = {
  user_id: string;
  total_sales: number;
  all_sales: AllSales[];
};
export default function ReportUI({ user_id, total_sales, all_sales }: Props) {
  const [currCategory, setCurrCategory] = useState<string | null>(null);
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
              <Icon src={category.src} alt={category.alt} />
              {category.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <ReportTable all_sales={all_sales} category={currCategory} />
    </div>
  );
}
