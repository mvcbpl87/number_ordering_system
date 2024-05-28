import OrderPage from "@/app/(main)/order/[date]/components/order-ui";
import { RetrieveAgentCredentials, currentAgent } from "@/server-actions";

export default async function Page({params}){
    const draw_date = decodeURIComponent(params.date);
    const user = await currentAgent();
    const agent = await RetrieveAgentCredentials(user.id)
    return(
        <OrderPage 
            agentId = {agent.id}
            draw_date ={draw_date}
        />
    )
}