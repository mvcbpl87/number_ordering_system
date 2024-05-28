'use client';
import { DateGenerator } from "@/utils/draw-date-generator";
import PopUpMessage from "./auth-action";
import DatePicker from "../shared/date-picker";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/spbClient";
import ClaimInput from "../form/claim-input";
const Wrapper = ({children}) =>{
    const style = ` border-black/20 rounded-b-[1.2rem] border-[0.05rem]
                    flex flex-col flex-1 overflow-y-scroll`;
    return(<div className={style}>{children}</div>)
}

const Labels = ()=>{
    const style = ` p-4 border-black/20 border-b-[0.05rem]
                    text-gray-600 text-sm
                    grid grid-cols-5 text-center
                    `;
    return(
    <div className={style}>
       <div>Ticket</div>
       <div>Number</div>
       <div>Draw</div>
       <div>Winning prize</div>
       <div>Status</div>
    </div>)
}
const ColumnContainer = ({children})=>{
    const style = `flex flex-col flex-1 overflow-y-auto`;
    return(<div className={style}>{children}</div>)
}
const Column = ({item,children}) =>{
    const {type_of_prize} = item;
    const {order_id, number, draw_date} = item.order_tickets
    const style = ` p-4 border-black/10 border-b-[0.02rem]
                    shadow-sm text-sm text-gray-600
                    text-center
                    grid grid-cols-5 justify-center items-center
                    `;
    return(
        <div className={style}>
           <div>{order_id}</div>
           <div>{number}</div>
           <div>{draw_date}</div>
           <div>{type_of_prize}</div>
           {children}
        </div>)
}
const EmptyColumn = ()=>{
    const style = ` p-4 border-black/10 border-b-[0.02rem]
                    shadow-sm text-sm text-gray-400
                    grid text-center italic
                    `;

    return(<div className={style}>No current winner</div>)
}
const ControlSection = ({children}) =>{
    const style = ` border-black/20 rounded-t-[1.2rem] border-[0.05rem]
                    p-4 bg-gray-200/20 text-gray-600
                    flex justify-start items-center
                    `;
    return(<div className={style}>{children}</div>)
}

const fetchCurrentShop = async()=>{
    const res = await fetch('/auth/shop',{
        method:'get'
    })
    const {status, response} = await res.json();
    if(status == 'error') throw new Error ('Unable to fetch current shop');
    else return response.location;
}
const fetchWinningSupabase = async(shop,category,draw_date)=>{
    const arg = {
        c_shop: shop,
        c_category: category,
        c_draw_date: draw_date
    }
    const checkWinner = await supabase.rpc('validate_winner', arg)
    if(checkWinner.error) throw new Error('Unable to find winners');

    const {data, error} = await supabase
    .from('winners')
    .select('*,order_tickets!inner(order_id, number, draw_date)')
    .eq('order_tickets.draw_date',draw_date)
    .eq('order_tickets.category', category)
    .eq('order_tickets.shop', shop)

    if(error) throw new Error('Unable to fetch winners');
    else return data

}
// export const revalidate = 0;
export default function WinnerInfo({category,shop}){
    const [date, setDate] = useState(null);
    const [items, setItems] = useState([]);
    const [current, setCurrent] = useState(null);
    const message = `Are you sure you wanted to claim this prize?`;
    const handleCancel = ()=> setCurrent(null)
    
    const handleConfirm = ()=>{
        setItems([
            /* Filter items !== current id for update claim status */
            ...items.filter(({id}) => id !== current.id),
            current /* Insert the update status claim */
        ])
       setCurrent(null)
    }
    useEffect(() => {
        const fetchWinners = async() =>{
            try{
                const listofWinners = await 
                fetchWinningSupabase(shop, category, date)
                setItems(listofWinners);
            
            }catch(error){
                console.log(error)
            }
        }// End of fetchWinners
        
        if(category) fetchWinners();
    }, [date, category, shop])
    
    return(
        <>
        <ControlSection>
            <DatePicker setState={setDate}/>
        </ControlSection>
        <Wrapper>
            <Labels/>
            <ColumnContainer>
            {   
                items.length <= 0?
                <EmptyColumn/>
                :
                items.map(
                    item=>
                    <Column 
                        key={item.id} 
                        item={item}>
                        <ClaimInput 
                                status={item.status} 
                                onClick={()=>setCurrent({...item, status:'claimed'})}
                        />
                    </Column>
                )
            }
            </ColumnContainer>
            {
             !current ?
             null:
             <PopUpMessage message={message} onCancel={handleCancel} onConfirm={handleConfirm}/>}
        </Wrapper>  
        </>  
    )
}
