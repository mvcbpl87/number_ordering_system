import {
  currentAgent,
  RetrieveAgentCredentials,
  RetrieveSalesOnRange,
} from "@/server-actions";
import ReportUI from "./components/report-ui";
import { DatePreset2 } from "@/lib/game-utils/draw-date-generator/preset";

function DateToStringConverter(_string_array: string[]): string {
  const temp = Array.from(
    { length: _string_array.length },
    (_, index) => `"${_string_array[index]}"`
  ).join(",");
  return `(${temp})`;
}

export default async function ReportPage() {
  const draw_dates = new DatePreset2().GET_DRAW_DATE();
  const dateToString = DateToStringConverter(draw_dates);
  const user = await currentAgent();
  const userCredentials = await RetrieveAgentCredentials(user.id);
  const sales: AllSales[] | undefined = await RetrieveSalesOnRange(
    dateToString
  );

  const { credits } = userCredentials;
  return (
    <div className="flex flex-col flex-1 flex-grow gap-4 bg-muted/20 p-4 md:gap-8 md:p-10">
      <ReportUI
        draw_dates={draw_dates}
        sales={!sales ? [] : sales}
        credit_value={!credits ? 0 : credits.credit_value}
      />
    </div>
  );
}
