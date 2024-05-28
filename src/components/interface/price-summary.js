// import { useEffect, useState } from "react";
import { sequence } from "../shared/template";
import { getUniquePermutation } from "@/utils/lib/permutation/boxbet";
const label_style = `text-end p-2 text-gray-500 italic`;
const amt_style = `p-2 text-center col-span-2 text-gray-800 `;
const col_style = `p-2`;
const col_end = `p-2 text-lg border-black border-opacity-10 border-t-[0.05rem]`
const Wrapper = ({children})=>{
    const style = `h-[70%] grid grid-cols-3`;
    return (<div className={style}>{children}</div>)
}

export default function PriceSummation({metadata}){
    const {soldOut,number, boxbet, big, small} = metadata;
    const generateTotalAmount =()=>{
        var results = 0;
        const calculateOrder = (target) =>{
            var subTotal = 0;
            var f_big= Number(big[target]);       // Format type string => Number for big
            var f_small =  Number(small[target]); // Format type string => Number for small
            if(!boxbet[target]){ // straight calculate order
                subTotal = f_big + f_small;
            }else{ // list down all permutation if it is boxbet
                const listofPermutation = getUniquePermutation(number[target])
                .filter( num => !soldOut.includes(num));
                const len = listofPermutation.length;
                subTotal = (f_big*len) + (f_small*len);
            }
            return subTotal;
        }
        /* There are two use Case */
        for(let i in sequence){
            let current = sequence[i]; //iterate through sequence to get the selected object
            results += calculateOrder(current);
        }
        return results;
    }
    const amount = generateTotalAmount();
    const tax = amount*(10/100);
    const total = amount+tax;
    return(
        <Wrapper>
            <div className={label_style}>
                <div className="text-transparent text-sm">item</div>
                <div className={col_style}>Subtotal</div>
                <div className={col_style}>SST 10%</div>
                <div className={col_style}>Total order</div>
            </div>
            <div className={amt_style}>
                <div className="text-sm italic text-gray-500">Amount&nbsp;(RM)</div>
                <div className={col_style}>{amount.toFixed(2)}</div>
                <div className={col_style}>{tax.toFixed(2)}</div>
                <div className={col_end}>{total.toFixed(2)}</div>
            </div>
        </Wrapper>
    )
}