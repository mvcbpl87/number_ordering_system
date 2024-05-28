import path from "@/utils/link-path";
import { Trophy, List } from "../shared/icons";
import Link from "next/link";
const tab_style = {
    focus: `flex justify-center items-center gap-2
    bg-red-500 text-white rounded-lg drop-shadow-md shadow-md text-sm py-2 px-4`,
    default:  `flex justify-center items-center gap-2
    text-gray-400 rounded-lg shadow-sm text-sm py-2 px-4`
}
const Wrapper = ({children})=>{
    const style = ` flex flex-wrap  gap-2 bg-white/90 p-1 rounded-lg shadow-md drop-shadow-md`;
    return(<div className={style}>{children}</div>)
}

const ReportTab = ({path,page}) =>{
    const style = page == 'report' ? tab_style.focus : tab_style.default;
    return(
    <Link href={path} className={style}>
        <List size='h-6 w-6' />&nbsp;Report
    </Link>)
}

const WinnerTab = ({path, page}) =>{
    const style = page == 'winning' ? tab_style.focus : tab_style.default;
    return(
    <Link href={path} className={style}>
        <Trophy size='h-6 w-6' />&nbsp;Winning
    </Link>)   
}
export default function PanelTab({page}){
    return(
        <Wrapper>
            <ReportTab path={path.report} page={page}/>
            <WinnerTab path={path.winning} page={page}/>
        </Wrapper>
    )
}