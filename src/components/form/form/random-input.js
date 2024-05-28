const Wrapper = ({children,onClick})=>{
    const style = ` text-xs italic h-[2rem] w-[2rem]  bg-amber-300
                    rounded-[0.2rem] drop-shadow-md
                    text-amber-700 font-semibold
                    border-yellow-700 border-opacity-20 border-[0.02rem]`;
    return(<button onClick={onClick} className={style}>{children}</button>)
}

const GenerateRandom = ()=>{
    var temp = ['','','',''];
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
      }
    return temp.map(item=> item = getRandomIntInclusive(1,9))
    
}
export default function RandomInput({
    sequence,
    setNumber, // locally update number 
}){
    const LuckyPick = ()=>{
        setNumber(
        current => 
        ({...current, [sequence]:GenerateRandom()}))
    }
    return(
    <Wrapper onClick={LuckyPick}>LP</Wrapper>)
}