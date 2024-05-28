import { useState } from "react";
const Wrapper = ({children}) =>{
    const style = `px-4`;
    return(<div className={style}>{children}</div>)
}
const ClaimButton = ({onClick})=>{
    const style = ` bg-yellow-500 text-orange-700 
                    py-2 px-5 
                    shadow-md drop-shadow-sm
                    rounded-md tracking-widest font-semibold
                    `;
    return(<button onClick={onClick} className={style}>Claim prize</button>)
}
const DefaultButton = () =>{
    const style = ` italic text-gray-400 py-1 px-5
                    rounded-md 
                    tracking-widest
                    font-semibold
                    `;
    return(<div className={style}>claimed</div>)
}

export default function ClaimInput({status, onClick}){
    return(
        <Wrapper>
            {
                status == 'not claimed'?
                <ClaimButton onClick={onClick}/>
                :
                <DefaultButton/>
            }
        </Wrapper>
    )
}