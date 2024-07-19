import ReportUI from "@/app/(main)/dashboard/report2/components/report-ui";
import { DatePreset2 } from "@/lib/game-utils/draw-date-generator/preset";
import { RetrieveAllSales, currentAgent } from "@/server-actions";
import { FilterDrawDateAndUserId } from "./components/hooks";

export default async function ReportPage() {
  let allSales: AllSales[] = [];
  const user = await currentAgent();
  /**
   * var: allSales fetch from server
   * @returns AllSales[] within a month time
   *
   * !Important for report
   * need to limit sales by few conditions
   * - All Sales must within the preset time period
   * and current userid only
   */
  const getSales = await RetrieveAllSales();
  allSales = !getSales ? [] : getSales;

  allSales = FilterDrawDateAndUserId(allSales, user.id);
  
  const total_sales = allSales.reduce((accumulator, current) => {
    const { ticket_numbers } = current;
    const { number, category, amount } = ticket_numbers!;
    const pivot = number.length * amount * category.length;
    return (accumulator += pivot);
  }, 0);

  return (
    <div className="flex flex-col flex-grow ">
      <ReportUI
        user_id={user.id}
        total_sales={total_sales}
        all_sales={allSales}
      />
    </div>
  );
}
