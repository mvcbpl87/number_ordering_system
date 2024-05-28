"use client";
import { useContext } from "react";
import { OrderMetadataContext } from "@/components/provider/order-provider";

export default function useOrderContext() {
  const context = useContext(OrderMetadataContext);
  if (!context) {
    throw new Error("useOrderContext must within the orderProvider boundary");
  }
  return context;
}
