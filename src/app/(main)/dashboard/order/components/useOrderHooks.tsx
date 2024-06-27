"use client";
import { InputTicketInstanceType } from "@/lib/types";
import { useState, Dispatch, SetStateAction } from "react";

type OrderHooksType = {
  metadata: InputTicketInstanceType[];
  maxBatch: number;
  isInCompleteList:string[];
  setMaxBatch: Dispatch<SetStateAction<number>>;
  setMetadata: Dispatch<SetStateAction<InputTicketInstanceType[]>>;
  handleNumberChange: (id: string, values: string) => void;
  handleBoxbetChange: (id: string, values: boolean) => void;
  handleBigChange: (id: string, values: number) => void;
  handleSmallChange: (id: string, values: number) => void;
  addNewColumn: () => void;
  checkIncomplete: (
    e: React.FocusEvent<HTMLInputElement, Element>,
    item_id: string
  ) => void;
  // handleOnChange: (id: string, values: any, entry: string) => void;
};

interface UseOrderHooksProps extends React.HTMLAttributes<HTMLDivElement> {}

const InputTicketGenerator = (seq: number): InputTicketInstanceType => {
  return { id: `ticket-${seq}`, number: "", boxbet: false, big: 0, small: 0 };
};
const InitInputTicket = () => {
  return Array.from({ length: 5 }, (_, i) => InputTicketGenerator(i + 1));
};
export default function UseOrderHooks() {
  const [isInCompleteList, setIsInCompleteList] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<InputTicketInstanceType[]>(
    InitInputTicket()
  );

  const handleNumberChange = (id: string, values: string) => {
    setMetadata((prev) => {
      let existingItem = [...prev];
      const index = existingItem.findIndex((item) => item.id === id);
      if (index === -1) return existingItem;
      existingItem[index]["number"] = values;
      return existingItem;
    });
  };
  const handleBoxbetChange = (id: string, values: boolean) => {
    setMetadata((prev) => {
      let existingItem = [...prev];
      const index = existingItem.findIndex((item) => item.id === id);
      if (index === -1) return existingItem;
      existingItem[index]["boxbet"] = values;
      return existingItem;
    });
  };
  const handleBigChange = (id: string, values: number) => {
    setMetadata((prev) => {
      let existingItem = [...prev];
      const index = existingItem.findIndex((item) => item.id === id);
      if (index === -1) return existingItem;
      existingItem[index]["big"] = values;
      return existingItem;
    });
  };
  const handleSmallChange = (id: string, values: number) => {
    setMetadata((prev) => {
      let existingItem = [...prev];
      const index = existingItem.findIndex((item) => item.id === id);
      if (index === -1) return existingItem;
      existingItem[index]["small"] = values;
      return existingItem;
    });
  };
  const addNewColumn = () => {
    setMetadata((prev) => [...prev, InputTicketGenerator(prev.length + 1)]);
  };

  const checkInComplete = (
    e: React.FocusEvent<HTMLInputElement, Element>,
    item_id: string
  ) => {
    const currNum = Array.from(e.target.value);
    if (currNum.length < 4) {
      setIsInCompleteList((prev) => [...prev, item_id]);
    } else {
      setIsInCompleteList((prev) => {
        let existItem = [...prev];
        let current = existItem.find(
          (exist_item_id) => exist_item_id === item_id
        );
        if (!current) return existItem;
        return existItem.filter((exist_item_id) => exist_item_id !== item_id);
      });
    }
  };
  return {
    metadata,
    setMetadata,
    isInCompleteList,
    handleNumberChange,
    handleBoxbetChange,
    handleBigChange,
    handleSmallChange,
    addNewColumn,
    checkInComplete
  };
}
