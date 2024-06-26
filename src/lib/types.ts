import React from "react";
import { z } from "zod";
export const UserAuthSchema = z.object({
  agent_id: z.string().min(1, { message: "Please enter your agent id" }),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
});

export const CreateSubAccountSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  username: z.string().min(1, { message: "Please enter your username" }),
  role: z.string(),
  parent: z.string(),
  tier: z.string(),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
  percent: z.number({ required_error: "Required commission rate" }),
});

export const ManageSubAccountSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  username: z.string().min(1, { message: "Please enter your username" }),
  role: z.string(),
  tier: z.string(),
  percent: z.number({ required_error: "Required commission rate" }),
});

export const UserProfileSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  role: z.string(),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
});
export type UserAuthSchemaType = z.infer<typeof UserAuthSchema>;
export type CreateSubAccountSchemaType = z.infer<typeof CreateSubAccountSchema>;
export type UserProfileSchemaType = z.infer<typeof UserProfileSchema>;
export type ManageSubAccountSchemaType = z.infer<typeof ManageSubAccountSchema>;
export type TierType = "1" | "2" | "3";
export type RoleType = "Owner" | "Admin" | "Agent";
export const TierTypeList: TierType[] = ["1", "2", "3"];
export const RoleTypeList: RoleType[] = ["Owner", "Admin", "Agent"];
export type SubAccountsColumnType = UsersWCommission;

export type shopType =
  | "Damacai"
  | "Cash Sweep"
  | "88 Diriwan"
  | "Magnum 4D"
  | "4D STC"
  | "Sports Toto";

export type TicketOrders = {
  user_id: string;
  number: { [key: string]: string[] };
  boxbet: { [key: string]: boolean };
  draw_date: string;
  big: { [key: string]: string };
  small: { [key: string]: string };
  amount: number;
  category: { [key in shopType]: boolean };
  sold_out: number[];
  phone_num: string;
};

export type TicketOrdersDispatch = {
  setNumber: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  setBoxbet: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  setBig: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  setSmall: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  setPhoneNum: React.Dispatch<React.SetStateAction<string | null>>;
};

export type CategoryListType = {
  src: string;
  alt: string;
  name: shopType;
  tag: string;
};
export const CategoryList: CategoryListType[] = [
  {
    src: "/assets/damacai.png",
    alt: "damacai",
    name: "Damacai",
    tag: "damacai",
  },
  {
    src: "/assets/cash-sweep.png",
    alt: "cash sweep",
    name: "Cash Sweep",
    tag: "cash_sweep",
  },
  {
    src: "/assets/double-eight.png",
    alt: "double eight",
    name: "88 Diriwan",
    tag: "diriwan_88",
  },
  {
    src: "/assets/magnum-4d.png",
    alt: "magnum",
    name: "Magnum 4D",
    tag: "magnum_4d",
  },
  {
    src: "/assets/stc-4d.png",
    alt: "Sandakan Turf Club",
    name: "4D STC",
    tag: "stc_4d",
  },
  {
    src: "/assets/toto-4d.png",
    alt: "Sports toto",
    name: "Sports Toto",
    tag: "sport_toto",
  },
];

export type InputTicketInstanceType = {
  id: string;
  number: string;
  boxbet: boolean;
  big: number;
  small: number;
};