import { Loader, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Loader className="animate-spin " />
    </div>
  );
}
