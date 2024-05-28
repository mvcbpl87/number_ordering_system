import { currentAgent } from "@/server-actions";
import WinningUI from "./components/winning-ui";

export const revalidate = 90;
export default async function WinningPage(){
    const user = await currentAgent();
    return (
        <div className="flex flex-col flex-grow ">
       <WinningUI/>
        </div>
      );
}