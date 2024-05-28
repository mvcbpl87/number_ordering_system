"use client";
import { supabase } from "@/utils/supabase/spbClient";
import { useState, useEffect } from "react";
import AmountInput from "./amount-input";
import BoxBet from "./boxbet-input";
import NumberInput from "./number-input";
// import { sequence } from "../../shared/icons";
import { sequence} from '@/components/shared/template'
import {Button} from '@/components/ui/button'
import { PlusCircle, Trash2 } from "lucide-react";
const Wrapper = ({ children }) => {
  const style = `   h-full flex flex-col flex-1
                    overflow-auto
                    rounded-[calc(1.5rem-0.5rem)]
                    border-black border-opacity-10 border-[0.05rem]`;
  return <div className={style}>{children}</div>;
};

const LabelsGroup = () => {
  const style = ` grid grid-cols-4 text-center text-sm p-2 text-gray-700
                    border-black border-opacity-10 border-b-[0.05rem]`;
  return (
    <div className={style}>
      <div>1+3D</div>
      <div>Game</div>
      <div>Big&nbsp;(大)</div>
      <div>Small&nbsp;(小)</div>
    </div>
  );
};

export default function OrderingTemplate({
  // draw_date,
  // category,
  state,
}) {
  const {
    soldOut,
    number,
    setNumber,
    boxbet,
    setBoxbet,
    big,
    setBig,
    small,
    setSmall,
  } = state;
  const [rows, setRows] = useState(sequence);
  const addNewRow = () => {
    console.log(number, boxbet)
    const totalRows = rows.length + 1;
    setRows((prev) => [...prev, `Row-${totalRows}`]);
    setNumber((prev) => ({ ...prev, [`Row-${totalRows}`]: ["", "", "", ""] }));
    setBoxbet((prev) => ({ ...prev, [`Row-${totalRows}`]: false }));
  };
  const deleteRow = (seq) => {
    if(rows.length < 5) return;
    if(seq == 'A' || seq == 'B' || seq == 'C' || seq == 'D' || seq == 'E') return;
    setRows((prev)=>{
        const filterItem = prev.filter((item) => item !== seq);
        return filterItem;
    })
    delete number[seq];
    delete boxbet[seq];
  };
  return (
    <Wrapper>
      <LabelsGroup />
      {rows.map((seq) => (
        <SequenceInput key={seq} onDelete={()=>deleteRow(seq)}>
          <NumberInput sequence={seq} state={{ soldOut, number, setNumber }} />
          <BoxBet
            sequence={seq}
            number={number[seq]}
            current={boxbet[seq]}
            state={{ soldOut, setBoxbet }}
          />
          <AmountInput sequence={seq} state={big[seq]} setState={setBig} />
          <AmountInput sequence={seq} state={small[seq]} setState={setSmall} />
        </SequenceInput>
      ))}
      <div className=" w-full mt-4 flex items-center justify-center p-2 ">
        <Button
          size={"sm"}
          variant={"ghost"}
          className="flex items-center gap-1  text-muted-foreground border-muted-foreground border-[1px]"
          onClick={addNewRow}
        >
          <PlusCircle size={15} />
          Add new number
        </Button>
      </div>
    </Wrapper>
  );
}

function SequenceInput({ children, onDelete }) {
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const style = ` text-sm text-center
                  p-2 relative
                  grid grid-cols-4
                  shadow-sm`;
  return (
    <div
      className={style}
      onMouseEnter={() => setIsMouseEnter(true)}
      onMouseLeave={() => setIsMouseEnter(false)}
    >
      {children}
      {isMouseEnter && (
        <div className="absolute right-0 h-full flex items-center px-4">
          <Button
            onClick={onDelete}
            size={"icon"}
            variant={"destructive"}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
