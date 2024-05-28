import { Printer } from "../shared/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatTime = (time) =>{
    const style = {timeStyle:'medium',dateStyle:'medium'}
    const f = new Intl.DateTimeFormat('en-us',style)
    return f.format(time)
}
const PdfGeneration = async(shop, category, content, total)=>{
    const header = ['Draw date', 'Big (大)', 'Small (小)', 'Total Sales' ];
    var doc = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
        putOnlyUsedFonts:true
    });
    doc.setTextColor(18,18,18);
    const fixed = {
      width:doc.internal.pageSize.width,
      center : doc.internal.pageSize.width/2,
      height:doc.internal.pageSize.height,
      offset:{
        top:20,
        bottom:20,
        left:20,
        right:20,
      }
    }
    var {top,left,right} = fixed.offset
    const invoice = top+10;
    doc.setFontSize(10).text('INVOICE',left,invoice);
    const title = invoice+30;
    doc.setFontSize(20).text('3D + 1',fixed.center,title,{align:'center'})
    const company = title + 12;
    doc.setFontSize(8).text('SUPEROLE SDN. BHD.',fixed.center, company,{align:'center'})
    const issuedate = company+10;
    doc.setFontSize(8).text(`Issue Date: ${formatTime(new Date())}`,fixed.center, issuedate,{align:'center'});
    const currentshop = issuedate+10
    doc.setFontSize(8).text(`Shop : ${shop}`,fixed.center, currentshop ,{align:'center'});
    const currCategory = currentshop + 10;
    doc.setFontSize(8).text(`Category : ${category}`,fixed.center, currCategory ,{align:'center'});
    const linepos = currCategory +10;
    doc.line(left,linepos, fixed.width-right, linepos,'S');

    const table1 = linepos+10;
    autoTable(doc,{
       theme:'grid',
       styles: { halign: 'center'},
       headStyles:{fillColor: [220,38,38]},
       bodyStyles: {overflow:'linebreak'},
       startY:table1 ,
       horizontalPageBreak:true,
       rowPageBreak: true,
       head:[header],
       body:content
    })
    let finalY = doc.previousAutoTable.finalY;
    autoTable(doc,{
        theme:'grid',
        styles: { halign: 'center'},
        headStyles:{fillColor: [220,38,38]},
        bodyStyles: {overflow:'linebreak'},
        startY: finalY+10,
        horizontalPageBreak:true,
        rowPageBreak: true,
        head:[['Shop Summary']],
        body:[]
      })
    finalY = doc.previousAutoTable.finalY;
    const tax = total*0.1;
    const postTaxTotal = tax + total
    autoTable(doc,{
        theme:'grid',
        styles: { halign: 'center' },
        startY:finalY,
        columnStyles:{0:{colSpan:6,fontStyle:'bold'}},
        body:[ 
            ['Total Amount',total.toFixed(2)],
            ['Tax (10%)',tax.toFixed(2)],
            ['Total + (Tax 10%)',postTaxTotal.toFixed(2)]]
      })
    var filename = `${crypto.randomUUID()}.pdf`
    doc.save(filename)
}


const Button = ({onClick})=>{
    const style = ` bg-red-500/90 text-white
                    p-2 w-[12rem] rounded-lg text-sm
                    drop-shadow-md shadow-sm 
                    flex justify-center items-center
                     hover:bg-red-500
                  `;
    return(<button onClick={onClick} className={style}><Printer size="h-5 w-5"/>&nbsp;Print Report</button>)
}


export default function PrintReport({
    items,
    shop,
    category
}){
    const CalculateTotal = (array)=>{
        let total = 0;
        for(let i in array){
            const {value} = array[i];
            total += value; 
        }
        return total;
    }
   
    const handleClick = async()=>{
        const content = items.map(item => Object.values(item))
        const total = CalculateTotal(items);
        await PdfGeneration(shop,category,content,total)
        // if(agg_sales.length > 0){
        //     const content = agg_sales.map(item=>Object.values(item));
        //     const total = CalculateTotal(agg_sales);
        //     await PdfGeneration(total, content)
        // }
    }
    return <Button onClick={handleClick}/>
}
