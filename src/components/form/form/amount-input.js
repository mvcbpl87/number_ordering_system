import { Minus, Plus } from "../../shared/icons";

const Wrapper = ({children})=>{
    const style = `flex justify-center items-center gap-2`;
    return(<div className={style}>{children}</div>)
}

const Input = ({onChange,value})=>{
    const style = ` rounded-[0.2rem] h-[2rem] w-[5rem] 
                    bg-white bg-opacity-90 text-center
                    border-black border-opacity-20 border-[0.07rem]
                    `;
    const amount = 0
    return (
        <input
            className={style}
            placeholder={amount.toFixed(2)}
            type = 'text'
            value ={value}
            onChange={onChange}
        />
    )
}
const MinusButton = ()=>{
    const style = ` bg-amber-300 text-amber-700
                    p-[0.2rem]
                    rounded-[0.2rem] 
                    drop-shadow-md
                    self-center`;
    return(<button className={style}><Minus size='w-5 h-5'/></button>)
}

const PlusButton = ()=>{
    const style = ` bg-amber-300 text-amber-700
                    p-[0.2rem]
                    rounded-[0.2rem] 
                    drop-shadow-md
                    self-center`;
    return(<button className={style}><Plus size='w-5 h-5'/></button>)
}
const Label = ({children})=>{
    const style = `h-[2rem] flex justify-center items-center text-gray-400 italic text-xs`;
    return(<div className={style}>{children}</div>)
}
export default function AmountInput({
    sequence,
    state,
    setState
}){
    const handleChange = (event) =>{
        const {value} = event.target;
        if(!isNaN(value)) /* If the value is type Number then setState */
        setState(current => ({...current, [sequence]:value}))
    }
    return(
        <Wrapper>
            {/* <MinusButton/> */}
            <Label>(RM)</Label>&nbsp;
            <Input 
                value = {state}
                onChange={handleChange}/>
            {/* <PlusButton/> */}
        </Wrapper>
    )
}