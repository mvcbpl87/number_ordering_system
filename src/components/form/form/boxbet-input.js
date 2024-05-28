'use client';
import { useState } from "react";
import { Check, ExclamationCircle, PlusCircle } from "../../shared/icons";
import { getUniquePermutation } from "@/utils/lib/permutation/boxbet";
const Wrapper = ({children}) =>{
    const style = `flex justify-center items-center gap-2`;
    return(<div className={style}>{children}</div>)
}

const DefaultBtn = ({onClick})=>{
    const style = ` h-[2rem] px-2 text-xs 
                    rounded-[0.2rem] 
                    drop-shadow-md
                    bg-gray-200 text-gray-700
                    flex justify-center items-center`;
    return (
        <button onClick={onClick} className={style}>
            <PlusCircle size='h-4 w-4'/>&nbsp;Box Bet
        </button>
    )
}

const FocusBtn = ({onClick})=>{
    const style = ` h-[2rem] px-2 text-xs 
                    rounded-[0.2rem] 
                    drop-shadow-md
                    bg-amber-300 text-green-700 font-semibold
                    flex justify-center items-center`;
    return (
        <button onClick={onClick} className={style}>
            <Check size='h-4 w-4'/>&nbsp;Box Bet
        </button>
    )
}
const SoldOutIndicator = ({style})=>{
    return(<div className={style}><ExclamationCircle size = 'h-6 w-6'/></div>)
}
const DumpCol = ({number}) => <div className="italic text-sm text-center text-red-500 border-black/20 border-b-[0.05rem] p-1">{number}</div>
const SoldOutActive = ({soldOut, state})=>{
    const {viewList, setViewList} = state;
    const style = 'text-red-500 relative ';
    const dump_style = `absolute bg-gray-100 italic text-gray-600
                        rounded-lg drop-shadow-md shadow-md p-2
                        mt-[0.2rem]
                        grid grid-cols-3 w-[12rem] gap-1
                        `
    return(
        <button 
            onMouseEnter={()=>setViewList(true)}
            onMouseLeave={()=>setViewList(false)}
            className={style}>
            <ExclamationCircle size = 'h-6 w-6'/>
            {
                viewList?
                <div className={dump_style}>
                {soldOut.map(num=><DumpCol key={num} number={num}/>)}
                </div>
                :
                null
            }
            
        </button>
    )
}
export default function BoxBet({
    sequence, 
    number,
    current,
    state
}){
    const {soldOut,setBoxbet} = state;
    // const soldout = [1234,5432,4231,2341,1432,4321];
    const [toggle,setToggle] = useState(current);
    const [isSoldOut, setSoldOut] = useState(false);
    const [dump, setDump] = useState([]);
    const [viewList, setViewList] = useState(false);
    const handleToggle = (type)=>{
        setToggle(type);
        setBoxbet(current => ({...current, [sequence]: type }))
        if(type == true){ /* If true get list of permutation */
            const listofPermutation = getUniquePermutation(number)
            .filter( num => soldOut.includes(num));
            const len = listofPermutation.length;
            if(len > 0){ 
                setSoldOut(true);
                setDump(listofPermutation)
            }
        }else{
            setSoldOut(false);
            setDump([])
        }
    }
    return(
        <Wrapper>
            {
                current?
                <FocusBtn onClick={()=>handleToggle(false)}/>
                :
                <DefaultBtn onClick={()=>handleToggle(true)}/>
            }
            {   
                isSoldOut?
                <SoldOutActive soldOut = {dump} state = {{viewList,setViewList}}/>
                :
                <SoldOutIndicator style = 'text-gray-300'/>
            }
            
        </Wrapper>
    )
}