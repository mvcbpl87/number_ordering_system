const LoadingSkeleton = ({setStyle}) =>{
    const style = setStyle;
    const row_skeleton = `  animate-pulse h-[0.7rem] 
                            mx-[20%]
                            rounded-full bg-gray-200 `;
    return(
    <div className={style}>
        <div className={row_skeleton}></div>
        <div className={row_skeleton}></div>
        <div className={row_skeleton}></div>
    </div>)
}
const Loading3 = ()=>{
    const arr = [0,1,2,3,4,5];
    const tab_style = {
        default: `px-2 py-3 bg-white/50 grid grid-cols-3 text-center`,
        alt: `px-2 py-3 bg-gray-100/90 grid grid-cols-3 text-center`,
    }
    return( 
        arr
        .map(
        item=>
        <LoadingSkeleton 
            setStyle={item%2? tab_style.default: tab_style.alt}
            key={item}/>
        )
    )
}
export default Loading3;