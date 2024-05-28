import { useState } from "react";
import { Squares } from "../shared/icons";
import { category_type } from "../shared/template";
import Image from "next/image";
const tab_style = {
    focus: `flex justify-center items-center gap-2
    bg-blue-900 text-white rounded-lg drop-shadow-md shadow-md text-sm py-2 px-4`,
    default:  `flex justify-center items-center gap-2
    text-gray-400 rounded-lg shadow-sm text-sm py-2 px-4`
}
const Wrapper = ({children}) =>{
    const style = `flex flex-wrap gap-2 bg-white/90 p-1 rounded-lg shadow-md drop-shadow-md`;
    return(
    <div className={style}>{children}</div>)
}
const Icon = ({alt, src})=>{
    const style = `rounded-lg w-6 h-6 relative`;
    const img = 'rounded-full'
    return(<div className={style}>
        <Image 
            fill
            priority
            className={img}
            alt = {alt}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{objectFit:'contain'}}
            src={src}/>
    </div>)
}
const Labels = ()=>{
    const style = ` flex justify-center items-center text-blue-900 p-2
                    font-semibold`;
    return(<div className={style}><Squares size='h-6 w-6'/>&nbsp;Category</div>)
}

const Tab = ({children, onClick, isSelect})=>{
    const style = isSelect ? tab_style.focus : tab_style.default
    return(<button onClick = {onClick} className={style}>{children}</button>)
}

export default function CategoryTab({
    state
}){
    const {category, setCategory} = state;
    /**
     * This wrap multiple tabs that consist
     * 6 different legal lottery company
     */

    const [isCheck, setCheck] = useState(category)
    const handleClick = (tag)=>{
        setCheck({...isCheck, [tag]: !isCheck[tag]}); // Act as toggle button
        setCategory({...category, [tag]:!isCheck[tag]})
    }   
    return(
    <Wrapper>
        {/* <pre>{JSON.stringify(isCheck)}</pre> */}
        <Labels/>
        {
        category_type
        .map(
            category=>
            <Tab 
                onClick={
                ()=>handleClick(category.name)
                }
                isSelect = {isCheck[category.name]}
                key ={category.name}>
                <Icon src={category.src} alt ={category.alt}/>
                &nbsp;{category.name}
            </Tab>
        )
        }
        {/* <Tab>Test</Tab> */}
    </Wrapper>
    )
}