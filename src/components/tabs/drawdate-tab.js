import { DatePreset } from "@/utils/draw-date-generator";
import path from "@/utils/link-path";
import { Calendar } from "../shared/icons";
import Link from "next/link";
const tab_style = {
    focus: ` self-center bg-red-400 text-white rounded-lg drop-shadow-md shadow-md text-sm p-2`,
    default:  ` text-gray-400 rounded-lg text-sm self-center p-2` 
}
const Wrapper = ({children})=>{
    const style = ` flex gap-2 bg-white/90 p-1 rounded-lg shadow-md drop-shadow-md`;
    return(<div className={style}>{children}</div>)
}

const Tab = ({children, current})=>{
    const style = current == children? tab_style.focus: tab_style.default;

    return(
        <Link href ={`${path.order}/${children}`} className={style}>{children}</Link>
    )
}
const Labels = ()=>{
    const style = ` flex justify-center items-center text-red-600 p-2
                    font-semibold`;
    return (<div className={style}><Calendar size='h-6 w-6'/>&nbsp;Draw date</div>)
}
export default function DrawDateTab({current}){
    /**
     * This wrap multiple tabs that consist
     * 4 consecutive draw dates
     */
    const drawdate = new DatePreset().GET_DRAW_DATE();
    return(
        <Wrapper>
            <Labels/>
            {
                drawdate.map(
                    (date,index) => 
                    <Tab 
                        key={index} 
                        current = {current}  
                    >{date}</Tab>
                )
            }
        </Wrapper>
    )
}