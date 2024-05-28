'use client';
import { useState } from "react";

const Wrapper = ({children}) =>{
    const style = ` w-[80%] 
    
    `;
    return(<div className={style}>{children}</div>)
}
const Input = ({value, onChange})=>{
    const style = `py-2 w-full bg-white/40 text-center
    hover:bg-white/50 text-black/80
    rounded-lg
    focus:outline-blue-500
    border-black/20 border-[0.05rem]
    `;
    return(
    <input
        type="password"
        placeholder="Input password"
        className={style}
        value={value}
        onChange={onChange}
    />
    )
}
export default function AuthInput({
    setPass
}){
    const [auth, setAuth] = useState('');
    const handleChange = event =>{
        const {value} = event.target;
        setAuth(value);
        setPass(value);
    }
    return(
    <Wrapper>
        <Input
            value={auth}
            onChange={handleChange}
            />
    </Wrapper>
    )
}