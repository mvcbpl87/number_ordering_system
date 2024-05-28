"use client";
import { useContext } from "react";
import { OrderCacheContext } from "@/components/provider/order-cache-provider";

export default function useOrderCacheContext() {
  const context = useContext(OrderCacheContext);
  if (!context) {
    throw new Error(
      "useOrderCacheContext must within the orderCacheProvider boundary"
    );
  }
  return context;
}
