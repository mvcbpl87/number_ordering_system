'use client';
import { useEffect} from "react";
import RandomInput from "./random-input";
const empty = '';
const entry = {
    backspace: 'Backspace',
    right: 'ArrowRight',
    left: 'ArrowLeft',
    up : 'ArrowUp',
    down: 'ArrowDown'
}
const Wrapper = ({children})=>{
    const style = ` 
                    rounded-lg
                    overflow-hidden
                    flex p-1 gap-[0.5rem]
                    justify-center items-center
                    `;
    return(<div className={style}>{children}</div>)
}

const Input = ({onChange, onKeyDown,value})=>{
    const style = ` rounded-[0.2rem] h-[2rem] w-[2rem] 
                    bg-white bg-opacity-90 text-center
                    border-black border-opacity-20 border-[0.07rem]
                    `;
    return (
        <input
            className={style}
            maxLength={1}
            type = 'text'
            value = {value}
            onChange={onChange}
            onKeyDown={onKeyDown}
        />
    )
}

const LuckyPick = () =>{
    const style = ` text-xs italic h-[2rem] w-[2rem]  bg-amber-300
                    rounded-[0.2rem] drop-shadow-md
                    text-amber-700 font-semibold
                    border-yellow-700 border-opacity-20 border-[0.02rem]`;
    return(<button className={style}>LP</button>)
}



export default function NumberInput({
    sequence,
    state
}){
    const { soldOut, number, setNumber} = state;
    const current_seq = number[sequence];
    useEffect(()=>{
        const number = Number(current_seq.join(''))
        if(soldOut.includes(number)){ 
            alert(`The number ${current_seq.join('')} is sold out`);
            setNumber(current => ({...current,[sequence]:['','','','']}))
        }
    },[current_seq, sequence, setNumber, soldOut])
  
    const input_type = [
        { id: 0, type:'first'},
        { id: 1, type:'second'},
        { id: 2, type:'third'},
        { id: 3, type:'fourth'}
    ];
    const handleChange = (event, id) =>{
        const {value, nextElementSibling} = event.target;
        const updateTarget = (value) => current_seq
        .map( (exist, index) => index == id ? value : exist)
        if(!isNaN(value)){
            setNumber(current => ({...current, [sequence]: updateTarget(value) }))
            if(nextElementSibling !==null && value !== empty) nextElementSibling.focus();
        }
               
    } // End of handleChange
    const handleKeypad = (event) =>{
        const {key} = event;
        const {value, previousElementSibling} = event.target;
        if( key == entry.backspace 
            && previousElementSibling !== null 
            && value == empty) 
            previousElementSibling.focus();
    } // End of handleKeypad

    return(
        <Wrapper>
            <RandomInput 
                sequence ={sequence} 
                setNumber={setNumber}/>
            {
                input_type
                .map(
                    type=>
                    <Input 
                        key={type.id} 
                        value = {!current_seq[type.id]?'': current_seq[type.id]}
                        onChange={(e)=>handleChange(e,type.id)}
                        onKeyDown={handleKeypad}
                    />
                )
            }
        </Wrapper>
    )
}