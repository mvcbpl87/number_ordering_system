import ReceiptUI from "@/app/(main)/order/receipt/components/receipt-ui";
import { DatePreset } from "@/utils/draw-date-generator";
import path from "@/utils/link-path";
import { redirect } from "next/navigation";

export default async function ReceiptPage() {
  const current = new DatePreset().GET_DRAW_DATE();

  return <ReceiptUI path={`${path.order}/${current[0]}`} />;
}
