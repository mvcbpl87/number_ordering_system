'use client';
import { useEffect, useState } from "react";
import { StoreFront } from "../shared/icons";
const Wrapper = ({children})=>{
    const style = `bg-white/40 w-[80%] relative`;
    return(<div className={style}>{children}</div>)
}
const Placeholder = ({children,onClick})=>{
    const style = ` w-full 
                    text-gray-800 
                    rounded-lg 
                    border-black/20 border-[0.05rem]
                    shadow-sm drop-shadow-lg 
                    flex text-center relative 
                    `;
    const icon_style = `absolute h-full px-4 
                        flex justify-center items-center 
                        border-black/20 border-r-[0.05rem] `;
    const input_style = `self-center w-full py-2  text-gray-600`
    return(
    <button 
        onClick={onClick}
        className={style}>
        <div className={icon_style}><StoreFront size='h-5 w-5'/></div>
        <div className={input_style}>
            {!children? 'Shop Location': children}
        </div>
    </button>)
}

const Dropdown = ({children})=>{
    const style = ` bg-gray-100 bg-opacity-[95%] z-10 absolute w-full mt-2 py-2
                    rounded-lg px-2 flex flex-col gap-2
                    border-black/20 border-[0.05rem]
                    
                    `
    return(
        <div className={style}>{children}</div>
    )
}
const column_state = {
    default: `w-full rounded-lg shadow-sm drop-shadow-sm text-gray-500 py-1`,
    focus:  `w-full rounded-lg shadow-sm drop-shadow-sm text-gray-700 py-1 border-black/20 border-[0.05rem]`
}
const Column = ({children, onClick,current})=>{
    const style = current == children ?  column_state.focus : column_state.default;
    return(<button onClick={onClick} className={style}>{children}</button>)
}
export default function ShopInput({
    current,
    setCurrent, // From the parent props
    shops
}){
    // const [shop, setShop] = useState(current);
    const [isOpen, setOpen] = useState(false);
    const handleToggle = ()=>{
        if(isOpen) setOpen(false);
        else setOpen(true)
    }

    const handleType = (type)=>{
        if(!type) type = 'Select Vendor'
        setCurrent(type);
        setOpen(!isOpen)
    }
    return(
    <Wrapper>
    <Placeholder onClick={handleToggle}>{current}</Placeholder>
    {
        !isOpen?
        null
        :
        <Dropdown>
        <Column /*---- Default column --- */
            current={current} 
            onClick={()=>handleType(null)}>
            Select Vendor</Column>
        {
            shops
            .map(
            type =>
            <Column 
                key={type}
                onClick={()=>handleType(type)}
                current = {current}
            >
            {type}
            </Column>
            )
        }
        </Dropdown>
    }
    </Wrapper>
    )
}