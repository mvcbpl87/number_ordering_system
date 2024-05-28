"use client";
import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

/* Total 7 properties that consists of amount, category, draw_date, gametype, number, order_id, shop (WIP agent) */
type MetadataProperties = {
  order_id: string;
  number: number;
  gametype: string;
  amount: number;
  draw_date: string;
  agent: string;
  category: string;
};
type orderCacheProp = {
  order_id:string,
  number: number;
  boxbet:number | null;
  gametype: string;
  draw_date:string,
  amount: number;
  category:string[],
}
type userInfoProps = {
  order_id: string |null;
  draw_date:string | null;
  purchaseAt: string | null;
  phoneNum: string | null;
};
type OrderContextType = {
  metadata: MetadataProperties[];
  orderCache: orderCacheProp[];
  userInfo: userInfoProps;
  selectedCategories: string[];
  addNewMetadata: (values: MetadataProperties) => void;
  resetMetadata: () => void;
  addNewOrderCache: (values:orderCacheProp) => void;
  resetOrderCache: () => void;
  updateUserInfo: (values: userInfoProps) => void;
  resetUserInfo: () => void;
  setSelectedCategories: Dispatch<SetStateAction<string[]>>
};

export const OrderMetadataContext = createContext<OrderContextType | null>(
  null
);

export default function OrderProvider({ children }: { children: ReactNode }) {
  const [metadata, setMetadata] = useState<MetadataProperties[]>([]);
  const [orderCache, setOrderCache] = useState<orderCacheProp[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<userInfoProps>({
    order_id:null,
    draw_date:null,
    purchaseAt: null,
    phoneNum: null,
  });
  const addNewMetadata = (values: MetadataProperties) => {
    setMetadata((prev) => [...prev, values]);
  };
  const resetMetadata = () => {
    setMetadata((prev) => (prev = []));
  };
  const addNewOrderCache = (values:orderCacheProp) =>{
    setOrderCache(prev => ([...prev, values]))
  }
  const resetOrderCache = () => (setOrderCache(prev => prev =[]))
  const updateUserInfo = (values: userInfoProps) => {
    setUserInfo((prev) => prev = values);
  };
  const resetUserInfo = () =>
    setUserInfo({
      order_id:null,
      draw_date:null,
      purchaseAt: null,
      phoneNum: null,
    });
  return (
    <OrderMetadataContext.Provider
      value={{
        metadata,
        userInfo,
        orderCache,
        selectedCategories,
        addNewMetadata,
        resetMetadata,
        addNewOrderCache,
        resetOrderCache,
        updateUserInfo,
        resetUserInfo,
        setSelectedCategories
      }}
    >
      {children}
    </OrderMetadataContext.Provider>
  );
}
