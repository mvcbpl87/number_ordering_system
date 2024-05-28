"use client";
// import useOrderContext from "@/components/hooks/useOrderContext";
import useOrderCacheContext from "@/hooks/use-order-cache";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import Image from "next/image";
import { category_type } from "@/components/shared/template";
import { supabase } from "@/utils/supabase/spbClient";
import { AgentOrderTicketsType, schema } from "@/utils/lib/types";
import { CategoryList } from "@/lib/types";
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gradient-to-b from-white via-red-100/20 to-transparent min-h-screen flex justify-center items-center">
      {children}
    </div>
  );
};
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
  path: string;
};
export default function ReceiptUI({ path }: Props) {
  const { orderInstances, metadata, resetMetadata } = useOrderCacheContext();
  const router = useRouter();

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

  const handleClick = async () => {
    try {
      resetMetadata();
      router.push(path);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };
  return (
    <Wrapper>
      <div className="min-w-[540px] max-w-fit shadow-md min-h-[640px]  p-4  flex flex-col justify-between">
        <div className="space-y-[1rem] mb-2">
          <div className="text-center font-semibold text-xl ">Receipt</div>
          <div className="grid grid-cols-2 gap-1 text-sm ">
            <div className="flex flex-col ">
              <span className="font-bold">Receipt no :</span>
              <span>
                {!orderInstances.receipt_id ? "--" : orderInstances.receipt_id}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold">Date purchase :</span>
              <span>
                {!orderInstances.created_at ? "--" : orderInstances.created_at}
              </span>
            </div>
            <div className="flex flex-col ">
              <span className="font-bold">Draw date :</span>
              <span>
                {!orderInstances.draw_date ? "--" : orderInstances.draw_date}
              </span>
            </div>
            <div className="flex flex-col items-end ">
              <span className="font-bold">Phone no:</span>
              <span>
                {!orderInstances.phone_number
                  ? "--"
                  : orderInstances.phone_number}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="h-full flex flex-col flex-grow mb-2 space-y-[1rem] mt-4">
          <div className="font-bold text-center">
            Tickets (Total: RM
            {cumulativeValue(metadata as TicketNumbers[]).toFixed(2)})
          </div>
          <div className=" flex flex-1 relative overflow-y-auto">
            <div className="absolute inset-0 ">
              <div className="grid grid-cols-3 text-xs text-muted-foreground">
                <span className="text-center">Number</span>
                <span className="text-center">Details</span>
                <span className="text-center">Shop</span>
              </div>
              {Object.keys(GroupingMetadata).map((item) => (
                <div
                  key={`Item-${item}`}
                  className="grid grid-cols-3 text-xs py-2 items-center"
                >
                  <span className="text-center">{item}</span>
                  <span className="text-center flex items-center justify-center gap-2">
                    {GroupingMetadata[item].map((ele, i) => (
                      <div
                        key={`item-${ele.id}-${i + 1}`}
                        className="flex items-center"
                      >
                        {!ele.boxbet
                          ? ele.amount * ele.category.length
                          : ele.amount *
                            ele.number.length *
                            ele.category.length}
                        &nbsp;
                        {ele.gametype === "Big" ? "B" : "S"}
                      </div>
                    ))}
                    {!GroupingMetadata[item][0].boxbet ? null : `(Box)`}
                  </span>
                  <span className="flex items-center justify-center gap-2">
                    {GroupingMetadata[item][0].category.length !== 0 &&
                      GroupingMetadata[item][0].category.map((currCate) => {
                        const cate = CategoryList.find(
                          (type) => type.name === currCate
                        );
                        if (!cate) return null;
                        return (
                          <div
                            key={`category-${cate.name}`}
                            className="flex justify-center items-center gap-1
                      text-muted-foreground rounded-lg text-xs"
                          >
                            <Icon src={cate.src} alt={cate.alt} />
                            {/* &nbsp;{cate.name.substring(0, 2).toUpperCase()} */}
                          </div>
                        );
                      })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button
          variant={"outline"}
          className="flex items-center gap-2 w-full bg-blue-900 text-white"
          onClick={handleClick}
        >
          <Store size={18} /> Back to merchant
        </Button>
      </div>
    </Wrapper>
  );
}
