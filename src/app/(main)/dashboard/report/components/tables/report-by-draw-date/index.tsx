import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SalesTable from "./sales-table";
import { ReduceSalesTableDataType } from "@/lib/types";

export default function ReportByDrawDate({
  data,
  selectCell,
}: {
  data: ReduceSalesTableDataType[];
  selectCell?: (target_draw_date: string) => void;
}) {
  return (
    <Card className="rounded">
      <CardHeader className="border-b">
        <CardTitle>Recent sales</CardTitle>
        <CardDescription>Recent sales within these draw dates.</CardDescription>
      </CardHeader>
      <CardContent className="py-4 h-[500px] relative">
        <SalesTable data={data} selectCell={selectCell}/>
      </CardContent>
    </Card>
  );
}
