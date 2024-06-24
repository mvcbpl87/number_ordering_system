import ReportUI from "@/app/(main)/dashboard/report/components/report-ui";
import { RetrieveAllSales, currentAgent } from "@/server-actions";

export const revalidate = 10;
export default async function ReportPage() {
  const user = await currentAgent();
  const allSales = await RetrieveAllSales() as AllSales[];
  const total_sales = allSales?.reduce((accumulator, current) => {
    const { ticket_numbers } = current;
    const { number, category, amount } = ticket_numbers!;
    const pivot = number.length * amount * category.length;
    return (accumulator += pivot);
  }, 0);
  return (
    <div className="flex flex-col flex-grow ">
      <ReportUI
        user_id={user.id}
        total_sales={total_sales!}
        all_sales={allSales.filter(item => item.user_id === user.id)}
      />
    </div>
  );
}
