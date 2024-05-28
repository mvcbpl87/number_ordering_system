export default function agentIdFormater(agentId:string){
    return agentId.split('@agent.auth')[0];
}