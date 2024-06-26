import path from "@/lib/path";
import ReceiptUI from "../components/receipt-ui";

export default function ReceiptPage() {
  return (
    <div className="flex flex-col flex-1 flex-grow gap-2  p-4 space-y-[1rem] md:p-6">
      <ReceiptUI path={path.game} />
    </div>
  );
}
