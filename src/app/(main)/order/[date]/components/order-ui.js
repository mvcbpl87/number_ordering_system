"use client";
import { StoreFront } from "@/components/shared/icons";
import { Input } from "@/components/ui/input";
import {
  num_temp,
  boxbet_temp,
  amt_temp,
  category_temp,
} from "@/components/shared/template";
import { useState, useEffect } from "react";
import { supabase } from "../../../../../supabase/spbClient";
import Link from "next/link";
import DrawDateTab from "@/components/tabs/drawdate-tab";
import path from "../../../../../lib/path";
import OrderTemplate from "@/components/form/form/order-template";
import PriceSummation from "@/components/interface/price-summary";
import SubmitOrder from "@/components/form/form/submit-order";
import CategoryTab from "@/components/tabs/category-tab";
import { HomeIcon, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import SubmitButton from "@/components/pages/game/SubmitButton";
const Wrapper = ({ children }) => {
  const style = ` bg-gradient-to-b from-blue-100/20 via-red-100/20 to-transparent
                    h-screen
                    flex flex-col gap-4
                    justify-center
                    py-6 px-6`;
  return <div className={style}>{children}</div>;
};
const PanelSection = ({ children }) => {
  const style = ` h-[8%]
                    flex justify-start items-center
                    gap-2
                    relative
                    `;
  return <div className={style}>{children}</div>;
};
const Home = ({ path }) => {
  const style = cn(
    buttonVariants({ variant: "ghost" }),
    ` bg-white p-2 rounded-lg 
  drop-shadow-md shadow-md shadow-red-500/20
  text-red-600 `
  );
  return (
    <Link href={path} className={style}>
      <HomeIcon size={20} />
    </Link>
  );
};
const ShopInfo = ({ children }) => {
  const style = ` flex gap-1 bg-white/90 p-2 rounded-lg 
                    shadow-md drop-shadow-md
                    text-red-600
                    absolute right-0 mr-2`;
  return (
    <Link href={path.signin} className={style}>
      <StoreFront size="h-6 w-g" />
      {children}
    </Link>
  );
};

const MainSection = ({ children }) => {
  const style = ` h-[65%]
                    grid gap-3
                    sm:grid-cols-1 md:grid-cols-4     
                  `;
  return <div className={style}>{children}</div>;
};
const Form = ({ children }) => {
  const style = ` bg-gradient-to-b from-blue-100/20 via-red-100/20 to-transparent
                    rounded-3xl p-4
                    flex flex-col gap-4
                    sm:col-span-1 md:col-span-3
                    shadow-md drop-shadow-lg
                    `;
  return <div className={style}>{children}</div>;
};
const Summary = ({ children }) => {
  const style = ` bg-gradient-to-b from-blue-100/20 via-red-100/20 to-transparent
                    rounded-3xl p-4
                    shadow-md drop-shadow-lg`;
  const Inner = ` rounded-[calc(1.5rem-0.5rem)]
                    flex flex-col relative
                    border-black border-opacity-10 border-[0.05rem] h-full`;

  const Labels = `text-center text-sm text-gray-700 p-2
                    border-black border-opacity-10 border-b-[0.05rem]`;
  return (
    <div className={style}>
      <div className={Inner}>
        <div className={Labels}>Summary</div>
        {children}
      </div>
    </div>
  );
};

export default function OrderPage({
  agentId /* Current agentId */,
  draw_date /* Display 4 consecutives draw date automatically */,
  // soldOut,    /* Provide a list of sold out number accordingly to respective draw date*/
}) {
  const [category, setCategory] = useState(category_temp);
  const [number, setNumber] = useState(num_temp);
  const [boxbet, setBoxbet] = useState(boxbet_temp);
  const [big, setBig] = useState(amt_temp);
  const [small, setSmall] = useState(amt_temp);
  const [soldOut, setSoldOut] = useState([]);
  const [phoneNum, setPhoneNum] = useState(null);
  useEffect(() => {
    const fetchSoldOut = async () => {
      try {
        const { data, error } =
          await supabase /* Retrieve sold out number from supabase */
            .from("sold_out_number")
            .select("number")
            .match({ draw_date });
        if (error) throw new Error("Unable to fetch sold out number");
        else {
          let temp = [];
          for (let index in data) {
            const { number } = data[index];
            temp.push(number);
          } // End of for loop
          setSoldOut(temp);
        } // end of else
      } catch (error) {
        alert(error);
      }
    };
    if (draw_date) fetchSoldOut();
  }, [draw_date]);
  return (
    <Wrapper>
      <PanelSection>
        <Home path={path.dashboard} />
        <DrawDateTab current={draw_date} />
        {/* <ShopInfo>{agentId}</ShopInfo> */}
      </PanelSection>
      <PanelSection>
        <CategoryTab state={{ category, setCategory }} />
      </PanelSection>
      <PanelSection>
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-muted-foreground flex items-center gap-2">
            {" "}
            <PhoneCall size={15} /> Contact number:
          </span>
          <Input
            className=" text-sm ring-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-none"
            placeholder="e.g 0124568876"
            value={!phoneNum ? "" : phoneNum}
            onChange={(e) => {
              const value = e.target.value;
              if (isNaN(value)) return;
              setPhoneNum(value);
            }}
          />
        </div>
      </PanelSection>
      <MainSection>
        <Form>
          <OrderTemplate
            /* Important! Required params for retrieve sold out number */
            draw_date={draw_date}
            category={category}
            state={{
              soldOut,
              number,
              setNumber,
              boxbet,
              setBoxbet,
              big,
              setBig,
              small,
              setSmall,
            }}
          />
        </Form>
        <Summary>
          <PriceSummation metadata={{ soldOut, number, boxbet, big, small }} />
          <SubmitButton
            metadata={{
              sold_out:soldOut,
              user_id:agentId,
              category,
              number,
              boxbet,
              big,
              small,
              draw_date,
              phone_num:phoneNum,
            }}
            state={{
              setNumber,
              setBoxbet,
              setBig,
              setSmall,
              setPhoneNum,
            }}
          />
        </Summary>
      </MainSection>
    </Wrapper>
  );
}
