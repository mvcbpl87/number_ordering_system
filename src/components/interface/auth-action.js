// Authentication confirm - handle and verify user action 
const Wrapper = ({children})=>{
    const style = ` fixed 
                    rounded-[1.4rem]
                    text-black
                    bg-gray-100/20 inset-0 
                    flex justify-center items-center
                    `;
    return(<div className={style}>{children}</div>)
}
const InnerBox = ({children,message})=>{
    const style = ` bg-white h-[60%] w-[30%]
                    text-gray-700 p-4
                    text-center
                    shadow-sm drop-shadow-sm
                    flex flex-col justify-center items-center
                    tracking-wider gap-5
                    rounded-lg`;
    const btn_wrapper = `flex gap-2 font-semibold`
    return(
    <div className={style}>
        {message}
        <div className={btn_wrapper}>
            {children}
        </div>
       
    </div>)
}
const ConfirmButton = ({onClick}) =>{
    const style = ` py-2 rounded-lg bg-green-500 w-[5.5rem]
                    drop-shadow-md shadow-md
                    text-green-800`;
    return(<button onClick={onClick} className={style}>Confirm</button>)
}
const CancelButton = ({onClick})=>{
    const style = ` py-2 rounded-lg bg-yellow-500 w-[5.5rem]
                    drop-shadow-md shadow-md
                    text-yellow-900`;
    return(<button onClick={onClick} className={style}>Cancel</button>)
}

export default function PopUpMessage({onConfirm, onCancel, message}){
    return(
        <Wrapper>
            <InnerBox message={message}>
                <ConfirmButton onClick={onConfirm}/>
                <CancelButton onClick={onCancel}/>
            </InnerBox>
        </Wrapper>
    )
}