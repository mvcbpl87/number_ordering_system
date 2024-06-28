"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CategoryList } from "@/lib/types";
import { cn } from "@/lib/utils";
import { IconTrophy } from "@tabler/icons-react";
import { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { IconImage } from "@/components/shared/IconImgTemplate";

export default function WinningUI() {
  const [currCategory, setCurrCategory] = useState<string | null>(null);
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
      <DataTable columns={columns} data={[]} />
    </div>
  );
}
