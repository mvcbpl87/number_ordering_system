"use client";
import { InputTicketInstanceType } from "@/lib/types";
import { createContext, useState, Dispatch, SetStateAction } from "react";

type OrderCacheProps = {
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
const InputTicketGenerator = (seq: number): InputTicketInstanceType => {
  return { id: `ticket-${seq}`, number: "", boxbet: false, big: 0, small: 0 };
};
const InitInputTicket = () => {
  return Array.from({ length: 5 }, (_, i) => InputTicketGenerator(i + 1));
};
export const OrderCacheContext = createContext<OrderCacheProps | null>(null);

interface OrderCacheProviderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export default function OrderCacheProvider({
  children,
}: OrderCacheProviderProps) {
  const [maxBatch, setMaxBatch] = useState(5);
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
  return (
    <OrderCacheContext.Provider
      value={{
        metadata,
        setMetadata,
        maxBatch,
        setMaxBatch,
        handleNumberChange,
        handleBoxbetChange,
        handleBigChange,
        handleSmallChange,
        addNewColumn,
      }}
    >
      {children}
    </OrderCacheContext.Provider>
  );
}
