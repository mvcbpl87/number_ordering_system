import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconAlertCircle, IconCirclePlus } from "@tabler/icons-react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { getUniquePermutation } from "@/lib/game-utils/permutation";
import OrderSubmit from "./order-submit";
import UseOrderHooks from "./useOrderHooks";
import LuckyPick from "@/lib/game-utils/number-generator";
import { Badge } from "@/components/ui/badge";

interface OrderTicketProps {
  categories: string[];
  drawDate: string;
  user_id: string;
  phone_number: string;
}

export default function OrderTicket({
  categories,
  drawDate,
  user_id,
  phone_number,
}: OrderTicketProps) {
  const {
    metadata,
    isInCompleteList,
    handleNumberChange,
    handleBoxbetChange,
    handleBigChange,
    handleSmallChange,
    addNewColumn,
    checkInComplete,
  } = UseOrderHooks();

  const TotalPrice = () => {
    return metadata.reduce((acc, item) => {
      let max_num = 1;
      const { big, small, number, boxbet } = item;
      if (boxbet) {
        const boxbet_num = Array.from(number, (num) => Number(num));
        const permutations = getUniquePermutation(boxbet_num);
        max_num = permutations.length;
      }
      return (acc += (big + small) * max_num * categories.length);
    }, 0);
  };
  const disabled =
    categories.length === 0 || phone_number === "" ? true : false;
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="whitespace-pre-wrap">
              Total Price: {TotalPrice().toFixed(2)}
            </span>
            <div className="px-4 py-1 bg-accent rounded-full border text-xs">
              Selected categories:&nbsp;{categories.length}
            </div>
            {/* <Badge variant={'secondary'}></Badge> */}
          </div>
        </CardTitle>
        <CardDescription>
          {disabled ? (
            <span className="text-destructive">
              Please provide customer phone number & select which categories to
              proceed.
            </span>
          ) : (
            <span>Recent orders from your store.</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-transparent"></TableHead>
              <TableHead className="text-center">Number</TableHead>
              <TableHead className="text-center">Boxbet</TableHead>
              <TableHead className="text-center">Big</TableHead>
              <TableHead className="text-center">Small</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metadata.map((item) => {
              const isInCompleteNumber = isInCompleteList.find(
                (exist_item_id) => exist_item_id === item.id
              )
                ? true
                : false;
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-center">
                      <Button
                        size={"sm"}
                        disabled={disabled}
                        onClick={() => {
                          const value = new LuckyPick().GetLuckyPick();
                          handleNumberChange(item.id, value);
                        }}
                      >
                        LP
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center gap-2">
                      <InputOTP
                        disabled={disabled}
                        maxLength={4}
                        value={item.number}
                        onChange={(value) => handleNumberChange(item.id, value)}
                        onBlur={(e) => checkInComplete(e, item.id)}
                      >
                        <InputOTPGroup>
                          {Array.from({ length: 4 }, (_, i) => i).map(
                            (slot_index) => (
                              <InputOTPSlot
                                index={slot_index}
                                key={`InputOTPSlot-${slot_index + 1}`}
                                className={cn(
                                  isInCompleteNumber && "border-destructive"
                                )}
                              />
                            )
                          )}
                        </InputOTPGroup>
                      </InputOTP>
                      <IconAlertCircle
                        className={cn(
                          "h-4 w-4 opacity-10",
                          isInCompleteNumber && "opacity-100 text-destructive"
                        )}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Toggle
                        disabled={disabled}
                        pressed={item.boxbet}
                        onPressedChange={(press) =>
                          handleBoxbetChange(item.id, press)
                        }
                        size={"sm"}
                        className={cn(
                          " font-normal text-xs",
                          item.boxbet &&
                            "data-[state=on]:bg-primary data-[state=on]:text-background"
                        )}
                        variant={"outline"}
                      >
                        Boxbet
                      </Toggle>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center relative">
                      <Input
                        disabled={
                          disabled || item.number === "" || isInCompleteNumber
                        }
                        placeholder="big"
                        className="text-center w-[70%]"
                        type="number"
                        value={item.big}
                        onChange={(e) => {
                          if (Number(e.target.value) < 0) return;
                          if (!isNaN(Number(e.target.value))) {
                            handleBigChange(item.id, Number(e.target.value));
                          }
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center relative">
                      <Input
                        disabled={
                          disabled || item.number === "" || isInCompleteNumber
                        }
                        placeholder="small"
                        className="text-center w-[70%]"
                        type="number"
                        value={item.small}
                        onChange={(e) => {
                          if (Number(e.target.value) < 0) return;
                          if (!isNaN(Number(e.target.value))) {
                            handleSmallChange(item.id, Number(e.target.value));
                          }
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex justify-center p-4">
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="border flex items-center gap-2"
                    onClick={addNewColumn}
                    disabled={disabled}
                  >
                    <IconCirclePlus className="h-4 w-4" />
                    <span>Add new column</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex justify-center p-4">
                  <OrderSubmit
                    isInCompleteList={isInCompleteList}
                    metadata={metadata}
                    disabled={disabled}
                    categories={categories}
                    drawDate={drawDate}
                    user_id={user_id}
                    phone_number={phone_number}
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
