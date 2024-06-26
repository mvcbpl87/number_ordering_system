"use client";
import { InputTicketInstanceType } from "@/lib/types";
import { useState, Dispatch, SetStateAction } from "react";

type OrderHooksType = {
  metadata: InputTicketInstanceType[];
  maxBatch: number;
  setMaxBatch: Dispatch<SetStateAction<number>>;
  setMetadata: Dispatch<SetStateAction<InputTicketInstanceType[]>>;
  handleNumberChange: (id: string, values: string) => void;
  handleBoxbetChange: (id: string, values: boolean) => void;
  handleBigChange: (id: string, values: number) => void;
  handleSmallChange: (id: string, values: number) => void;
  addNewColumn: () => void;
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

  return {
    metadata,
    setMetadata,
    handleNumberChange,
    handleBoxbetChange,
    handleBigChange,
    handleSmallChange,
    addNewColumn,
  };
}
