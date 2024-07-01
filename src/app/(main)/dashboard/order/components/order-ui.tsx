"use client";
import { DatePreset2 } from "@/lib/game-utils/draw-date-generator/preset";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { CategoryList } from "@/lib/types";
import { IconImage } from "@/components/shared/IconImgTemplate";
import OrderTicket from "./order-ticket";
import { Input } from "@/components/ui/input";
import { IconPhone } from "@tabler/icons-react";

type DrawDatePickerProps = {
  currentDate: string;
  dateList: string[];
  select: React.Dispatch<React.SetStateAction<string>>;
};
function DrawDatePicker({
  select,
  dateList,
  currentDate,
}: DrawDatePickerProps) {
  return (
    <Select onValueChange={select} value={currentDate}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select draw date" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Draw date</SelectLabel>
          {dateList.map((date, idx) => (
            <SelectItem value={date} key={`draw_date_${date}-${idx + 1}`}>
              {date}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

type CategoryPickerProps = {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
};
function CategoryPicker({ categories, setCategories }: CategoryPickerProps) {
  return (
    <div className="flex items-center flex-wrap ">
      <ToggleGroup
        type="multiple"
        defaultValue={categories}
        onValueChange={setCategories}
      >
        {CategoryList.map((category) => (
          <ToggleGroupItem
            key={category.name}
            value={category.name}
            aria-label="Toggle bold"
            className="border"
          >
            <div className="flex items-center gap-2 py-2">
              <IconImage src={category.src} alt={category.alt} />
              {category.name}
            </div>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

type OrderUIProps = {
  user_id: string;
};
export default function OrderUI({ user_id }: OrderUIProps) {
  const dateList = new DatePreset2().GET_DRAW_DATE();
  const [drawDate, setDrawDate] = useState<string>(dateList[0]);
  const [categories, setCategories] = useState<string[]>([]);
  const [phoneNum, setPhoneNum] = useState<string>("");
  return (
    <div className="grid gap-[1rem]">
      <DrawDatePicker
        currentDate={drawDate}
        select={setDrawDate}
        dateList={dateList}
      />
      <CategoryPicker categories={categories} setCategories={setCategories} />
      <div className="flex items-center gap-2">
        <IconPhone className="h-4 w-4" />{" "}
        <Input
          placeholder="Customer phone"
          value={phoneNum}
          onChange={(e) => {
            setPhoneNum((prev) => (prev = e.target.value));
          }}
        />
      </div>

      <OrderTicket
        drawDate={drawDate}
        categories={categories}
        user_id={user_id}
        phone_number={phoneNum}
      />
    </div>
  );
}
