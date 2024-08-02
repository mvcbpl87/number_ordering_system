import { currentAgent } from "@/server-actions";
import WinningUI from "./components/winning-ui";

export default async function WinningPage() {
  const user = await currentAgent();

  return (
    <div className="flex flex-col flex-grow ">
      <WinningUI user_id={user.id} />
    </div>
  );
}
