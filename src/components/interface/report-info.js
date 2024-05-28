"use client";
import { useState, useEffect } from "react";
import { DatePreset } from "@/utils/draw-date-generator";
import { Calendar } from "../shared/icons";
import PrintReport from "../pdf-generator/pdf-report";
import { supabase } from "@/utils/supabase/spbClient";
import Loading3 from "@/components/loader/three-cols-loader";
import { useModal } from "../provider/modal-provider";
import { CustomModal } from "@/components/shared/custom-modal";
import ViewCustomerOrder from "@/app/(main)/dashboard/report/components/view-customer-order";
const Wrapper = ({ children }) => {
  const style = ` border rounded-b-[1.2rem] 
                    h-full flex flex-col flex-grow`;
  return <div className={style}>{children}</div>;
};

const Labels = () => {
  const style = ` py-4 px-4 border-b
                     text-gray-600 font-semibold
                    grid grid-cols-3 text-center
                    `;
  return (
    <div className={style}>
      <div className="flex justify-center items-center">
        <Calendar size="h-5 w-5" />
        &nbsp;Draw date
      </div>
      <div>Big&nbsp;(大)</div>
      <div>Small&nbsp;(小)</div>
    </div>
  );
};

const SummaryColumn = ({ draw_date, big, small, onClick }) => {
  const style = ` p-4 border-b 
                    shadow-sm
                    text-lg text-gray-600
                    grid grid-cols-3 text-center hover:bg-secondary`;

  return (
    <div className={style} onClick={onClick}>
      <div>{draw_date}</div>
      <div>{big}</div>
      <div>{small}</div>
    </div>
  );
};
const ControlSection = ({ children }) => {
  const style = ` border rounded-t-[1.2rem] 
                    p-4 bg-gray-200/20 text-gray-600
                    flex justify-start items-center
                    `;
  return <div className={style}>{children}</div>;
};

export const revalidate = 0;
const draw_date = new DatePreset().GET_DRAW_DATE();
const TotalSales = async (category, draw_date, gametype, agentId) => {
  const arg = {
    c_gtype: gametype,
    c_category: category,
    c_draw_date: draw_date,
    c_agent_id: agentId,
  };
  const { data, error } = await supabase.rpc("total_sales_summation", arg);
  if (error) throw new Error("Unable to fetch orders from server");
  return data == null ? 0 : data;
}; // End of total sales

const DataCapsule = (draw_date, big, small, value) => ({
  draw_date,
  big,
  small,
  value,
});
export default function ReportInfo({ category, agentId }) {
  const modal = useModal();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecentTickets = async () => {
      setLoading(true);
      try {
        let temp = [];
        for (let index in draw_date) {
          const current = draw_date[index];
          const big = await TotalSales(category, current, "Big", agentId);
          const small = await TotalSales(category, current, "Small", agentId);
          const total = big + small;
          temp.push(DataCapsule(current, big, small, total));
        }
        setItems(temp);
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };
    if (category && agentId) fetchRecentTickets();
    return () => setItems([]);
  }, [category, agentId]);

  const viewOrderDetail = (drawDate) => {
    modal.setOpen(
      <CustomModal title="Order details" subheading="All order made by agent">
        <ViewCustomerOrder agentId={agentId} drawDate={drawDate} />
      </CustomModal>
    );
  };
  return (
    <>
      <ControlSection>
        <PrintReport agentId={agentId} category={category} items={items} />
      </ControlSection>
      <Wrapper>
        <Labels />
        {loading && <Loading3 />}
        {loading
          ? null
          : (items.length !== 0 ? items.map((item) => (
            <SummaryColumn
              key={item.draw_date}
              onClick={() => viewOrderDetail(item.draw_date)}
              draw_date={item.draw_date}
              big={item.big}
              small={item.small}
            />
          )) : <div className="flex items-center justify-center mt-4 text-muted-foreground">Please select category</div>)}
      </Wrapper>
    </>
  );
}
