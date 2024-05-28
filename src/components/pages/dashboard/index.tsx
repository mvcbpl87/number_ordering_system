'use client';

import { cn } from "@/lib/utils";

type SalesContentType = {
    title: string,
    icon:React.ElementType,
    value: number|null,
    description:string,
}

type Props = {
    className?:string
    data: SalesContentType[],

}
export default function DashboardPage({className, data}:Props){
    const style = cn()

}