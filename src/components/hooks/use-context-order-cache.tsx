"use client";
import { useContext } from "react";
import { OrderCacheContext } from "../provider/order-provider";

export default function useOrderCacheContext() {
  const context = useContext(OrderCacheContext);
  if (!context) {
    throw new Error(
      "useOrderCacheContext must within the orderCacheProvider boundary"
    );
  }
  return context;
}
