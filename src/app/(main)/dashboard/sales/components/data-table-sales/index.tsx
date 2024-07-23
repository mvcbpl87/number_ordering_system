import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ReduceSalesTableDataType } from "@/lib/types";
import { SalesTable } from "./sales-table";
import { columns } from "./columns";

export default function SalesDataTable({
  data,
  selectCell,
}: {
  data: AllSales[];
  selectCell?: (target_draw_date: string) => void;
}) {
  return (
    <Card className="rounded">
      <CardHeader className="border-b">
        <CardTitle>Recent sales</CardTitle>
        <CardDescription>Recent sales within these draw dates.</CardDescription>
      </CardHeader>
      <CardContent className="py-4 h-[500px] relative">
        <SalesTable data={data} columns={columns}/>
      </CardContent>
    </Card>
  );
}
