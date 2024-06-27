"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconChevronLeft, IconCopy, IconShare2 } from "@tabler/icons-react";
import { IconImage } from "@/components/shared/IconImgTemplate";
import { CategoryList } from "@/lib/types";
import useOrderCacheContext from "@/hooks/use-order-cache";
import { useRouter } from "next/navigation";
import { Copy, MoreVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Props = {
  path: string;
};

type ReceiptCardProps = {
  metadata: TicketNumbers[];
};
function ReceiptCard({ metadata }: ReceiptCardProps) {
  const GroupingMetadata = metadata.reduce(
    (groups: { [key: string]: TicketNumbers[] }, meta) => {
      const sameNumber = meta.number[0];
      if (!groups[`${sameNumber}`]) {
        groups[sameNumber] = [];
      }
      groups[sameNumber].push(meta);
      return groups;
    },
    {}
  );
  const GametypeDetails = (orderNum: string) => {
    return GroupingMetadata[orderNum].map((ele, i) => (
      <div key={`item-${ele.id}-${i + 1}`} className="flex items-center">
        {ele.gametype === "Big" ? `${ele.amount}B` : `${ele.amount}S`}
      </div>
    ));
  };
  const BoxbetDetails = (orderNum: string) => {
    const {boxbet, number} = GroupingMetadata[orderNum][0];
    return !GroupingMetadata[orderNum][0].boxbet ? null : `(B${number.length})`;
  };
  const SelectedShopsActive = (orderNum: string, currCategory: string) => {
    return GroupingMetadata[orderNum][0].category.find(
      (item) => item === currCategory
    )
      ? true
      : false;
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] sr-only">No.</TableHead>
          <TableHead className="text-center">number</TableHead>
          <TableHead className="text-center">details</TableHead>
          <TableHead className="w-[100px] text-center">Shop</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.keys(GroupingMetadata).map((item, index) => (
          <TableRow key={`RowItem-${item}`}>
            <TableCell className="font-semibold w-[100px] text-center">
              {index + 1}
            </TableCell>
            <TableCell>
              <div className="flex h-9 w-full rounded-md items-center justify-center bg-transparent px-3 py-1 text-sm transition-colors">
                {item}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex h-9 w-full rounded-md items-center justify-center bg-transparent px-3 py-1 text-sm transition-colors gap-1">
                {GametypeDetails(item)}
                {BoxbetDetails(item)}
              </div>
            </TableCell>
            <TableCell className="w-[100px]">
              <div className="flex items-center justify-center gap-1">
                {CategoryList.map((category) => (
                  <div
                    key={`category-${category.name}`}
                    className={cn(
                      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-2 border border-input invisible",
                      SelectedShopsActive(item, category.name) && "visible"
                    )}
                  >
                    <IconImage src={category.src} alt={category.alt} />
                  </div>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ReceiptUI({ path }: Props) {
  const { orderInstances, metadata, resetMetadata } = useOrderCacheContext();
  const router = useRouter();

  const receipt_id = !orderInstances.receipt_id
    ? "--"
    : orderInstances.receipt_id;
  const created_at = !orderInstances.created_at
    ? "--"
    : orderInstances.created_at;
  const draw_date = !orderInstances.draw_date ? "--" : orderInstances.draw_date;
  const phone_number = !orderInstances.phone_number
    ? "--"
    : orderInstances.phone_number;

  const cumulativeValue = (array: TicketNumbers[]) => {
    let result = array.reduce((accumulator, currentValue) => {
      const { boxbet, amount, number, category } = currentValue;

      const pivot = !boxbet
        ? amount * category.length
        : number.length * amount * category.length;
      return (accumulator += pivot);
    }, 0);
    return !result ? 0 : result;
  };

  const handleClick = async () => {
    try {
      router.push(path);
      resetMetadata();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" flex flex-col flex-1 flex-grow gap-2 p-4 space-y-[1rem] md:p-10">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleClick}
        >
          <IconChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Back to Merchant
        </h1>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Order {`${receipt_id}`}
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
            <CardDescription>
              Purchase time&nbsp;:&nbsp;{`${created_at}`}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" variant="outline" className="gap-1">
              <IconCopy className="h-3.5 w-3.5" />
              Copy
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <IconShare2 className="h-3.5 w-3.5" />
              Share receipt
            </Button>
            <Button size="icon" variant="outline" className="h-8 w-8">
              <MoreVertical className="h-3.5 w-3.5" />
              <span className="sr-only">More</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <div className="font-semibold">Customer contacts</div>
              <span className="text-muted-foreground">{phone_number}</span>
            </div>
            <div className="grid auto-rows-max gap-3">
              <div className="font-semibold">Draw date</div>
              <div className="text-muted-foreground">{draw_date}</div>
            </div>

            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4 items-center font-semibold">
                <span className="text-muted-foreground">Total</span>
                <span>
                  RM{cumulativeValue(metadata as TicketNumbers[]).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />
          <div className="grid pt-4">
            <div className="font-semibold">Order details</div>
            <ReceiptCard metadata={metadata} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center justify-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-center text-muted-foreground">
            Updated <time dateTime={created_at}>{created_at}</time>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
