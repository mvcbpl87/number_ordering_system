"use client";
import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type NewTicketInstance = {
  receipt_id: string | null;
  phone_number: string | null;
  draw_date: string | null;
  created_at: string | null;
};
type OrderCacheProps = {
  orderInstances: NewTicketInstance;
  metadata: TicketNumbers[];
  addNewMetadata: (
    values: TicketNumbers[],
    instance: NewTicketInstance
  ) => void;
  resetMetadata: () => void;
};
export const OrderCacheContext = createContext<OrderCacheProps | null>(null);

const TicketInstance = {
  receipt_id: null,
  phone_number: null,
  draw_date: null,
  created_at: null,
};
export default function OrderCacheProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [instances, setInstances] = useState<NewTicketInstance>(TicketInstance);
  const [metadata, setMetadata] = useState<TicketNumbers[]>([]);

  const addNewMetadata = (
    values: TicketNumbers[],
    instance: NewTicketInstance
  ) => {
    setMetadata((prev) => (prev = values));
    setInstances((prev) => (prev = instance));
  };
  const resetMetadata = () => {
    setMetadata((prev) => (prev = []));
    setInstances((prev) => (prev = TicketInstance));
  };

  return (
    <OrderCacheContext.Provider
      value={{
        orderInstances: instances,
        metadata,
        addNewMetadata,
        resetMetadata,
      }}
    >
      {children}
    </OrderCacheContext.Provider>
  );
}
