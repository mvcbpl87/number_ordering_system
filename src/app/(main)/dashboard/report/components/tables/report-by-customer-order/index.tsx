import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ReduceReceiptInstanceType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  IconCashBanknote,
  IconCoinBitcoinFilled,
  IconCurrencyDollar,
  IconListSearch,
} from "@tabler/icons-react";
import { DataTableReport } from "./order-details-table";
import { columns } from "./columns";

interface ReportByCustomerOrderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  creditBalance: number;
  currentReceipt: string | undefined;
  receiptInstances: ReduceReceiptInstanceType[];
  selectReceipt: (target_receipt: string) => void;
  orderDetails: (ReduceReceiptInstanceType & { metadata: AllSales[] }) | null;
  locale?: string;
  updateCacheSales: (_target: AllSales[]) => void;
}
export default function ReportByCustomerOrder({
  open,
  setOpen,
  creditBalance,
  receiptInstances,
  currentReceipt,
  selectReceipt,
  orderDetails,
  updateCacheSales,
  locale = "RM",
}: ReportByCustomerOrderProps) {
  if (receiptInstances.length === 0)
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetHeader className="hidden">
          <SheetDescription className="sr-only">Blank</SheetDescription>
        </SheetHeader>
        <SheetContent>
          <SheetTitle className="sr-only hidden">Title</SheetTitle>
          <div className="h-full grid items-center justify-center">
            <div className="[&>svg]:text-card-foreground/80 flex flex-col justify-center items-center">
              <IconListSearch className="h-24 w-24" />
              <span className="text-card-foreground/80">
                No receipt for this draw dates.
              </span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetHeader className="hidden">
        <SheetDescription className="sr-only">Blank</SheetDescription>
      </SheetHeader>
      <SheetContent
        className="sm:max-w-[860px]"
        aria-describedby="sheet"
        aria-description="what"
      >
        <SheetTitle className="sr-only hidden">Test</SheetTitle>
        <div className="grid md:grid-cols-[240px,1fr] gap-[1rem] mt-4 h-full ">
          {/* --- Receipt List ----- */}
          <div className="gap-1 flex flex-col border-r pr-4 overflow-auto">
            <Label htmlFor="Receipt" className="font-medium mb-2">
              Receipt
            </Label>
            {receiptInstances.map((ele) => (
              <div
                key={`receipt-key-${ele.receipt_id}`}
                className={cn(
                  "flex items-center justify-between text-sm font-light rounded-lg px-4 py-2 border-l-4 shadow-md cursor-pointer mb-2 select-none hover:translate-x-2 hover:border-primary transition-all",
                  ele.receipt_id === currentReceipt &&
                    "border-primary translate-x-2"
                )}
                onClick={() => selectReceipt(ele.receipt_id)}
              >
                <span className="">{ele.receipt_id}</span>
                {ele.num_of_tickets > 0 && (
                  <span className="rounded-full h-5 w-5 text-xs bg-primary flex items-center justify-center text-background">
                    {ele.num_of_tickets}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* ---- Order Details Table --- */}
          <div className="relative space-y-[1rem] overflow-y-auto px-2 ">
            <div className="grid gap-2 text-sm ">
              <span className="font-medium">
                Order details&nbsp;{orderDetails?.receipt_id}
              </span>
              <span className="text-muted-foreground text-xs">
                Contact:&nbsp;{orderDetails?.phone_number}
              </span>
              <div className="text-xs font-medium flex gap-1 items-center text-yellow-500">
                <IconCoinBitcoinFilled className="h-4 w-4" />
                <span>
                  {locale}&nbsp;:&nbsp;{creditBalance.toFixed(2)}
                </span>
              </div>
              <div className="grid gap-2 w-[200px]">
                <div className="text-xs gap-1 font-medium flex items-center [&>svg]:text-muted-foreground">
                  <IconCashBanknote className="h-4 w-4" />
                  <span>
                    Paid&nbsp;:&nbsp;{locale}
                    {orderDetails?.total_paid_per_receipt.toFixed(2)} /{" "}
                    {orderDetails?.total_sales_per_receipt.toFixed(2)}
                  </span>
                </div>
                <Progress
                  value={
                    !orderDetails
                      ? 0
                      : (orderDetails.total_paid_per_receipt /
                          orderDetails.total_sales_per_receipt) *
                        100
                  }
                  className="h-1"
                />
              </div>
            </div>
            <Separator />
            <DataTableReport
              columns={columns}
              data={orderDetails ? orderDetails.metadata : []}
              updateCacheSales={updateCacheSales}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
