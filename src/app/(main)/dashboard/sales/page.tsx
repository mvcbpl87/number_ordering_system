import SalesUI from "./components/sales-ui";

export default function SalesPage() {
  return (
    <div className="flex flex-col flex-1 flex-grow gap-4 bg-muted/20 p-4 md:gap-8 md:p-10">
      <SalesUI />
    </div>
  );
}
