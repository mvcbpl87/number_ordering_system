"use client";
import generateUUID from "@/utils/uuid-generator";
import { Ticket } from "../../shared/icons";
import { supabase } from "@/utils/supabase/spbClient";
import {
  amt_temp,
  boxbet_temp,
  category_type,
  num_temp,
  sequence,
} from "../../shared/template";
import { getUniquePermutation } from "@/utils/lib/permutation/boxbet";
import { useToast } from "@/components/ui/use-toast";
import useOrderContext from "@/hooks/useOrderContext";
import { useRouter } from "next/navigation";
import { BufferExecution } from "@/lib/utils";
import { schema } from "@/utils/lib/types";
const SubmitButton = ({ onClick }) => {
  const style = `absolute w-full h-full flex justify-center items-end py-10`;
  const btnStyle = `  w-[80%] p-3 bg-red-600 rounded-lg tracking-wide
                        font-semibold text-amber-400
                        flex justify-center items-center text-center
                        drop-shadow-md drop-shadow-amber-600/20 shadow-md shadow-amber-600/50`;
  return (
    <div className={style}>
      <button onClick={onClick} className={btnStyle}>
        <Ticket size="h-5 w-5" />
        &nbsp;Buy Ticket&nbsp;
        <Ticket size="h-5 w-5" />
      </button>
    </div>
  );
};

const CheckError = (
  /*Check error if no defined category and number input */
  selectedCategory, // Required lottery category
  number, // Required lottery number
  phoneNum
) => {
  if (!phoneNum)
    throw new Error("No contact number provided. Please insert contact number");
  if (selectedCategory.length <= 0 && number == 0)
    throw new Error("Missing required information");
  else if (selectedCategory.length <= 0)
    throw new Error("Please select category");
  else if (number == 0) throw new Error("Please insert number");
};

const CheckAmountError = (currentNumber, Big, Small) => {
  if (currentNumber > 0) {
    console.log(currentNumber, Big == 0 && Small == 0);
    if (Big == 0 && Small == 0)
      throw new Error("Please enter either big or small");
  }
  // console.log(currentNumber.length > 0 &&( Big == 0 && Small == 0) )
};
export default function SubmitOrder({ metadata, state }) {
  const { updateUserInfo, addNewOrderCache } = useOrderContext();
  const router = useRouter();
  const {
    /* Required parameters (7) ! To insert through live databases */
    agentId,
    soldOut,
    category,
    number,
    boxbet,
    big,
    small,
    draw_date,
    phoneNum,
  } = metadata;
  const { toast } = useToast();
  const {
    // For updating metadata
    setNumber,
    setBoxbet,
    setBig,
    setSmall,
    setPhoneNum,
  } = state;

  const reset = () => {
    // Reset all exisiting metadata;
    setNumber(num_temp);
    setBoxbet(boxbet_temp);
    setBig(amt_temp);
    setSmall(amt_temp);
    setPhoneNum(null);
  };

  const defineCategory = (category) => {
    let result = [];
    for (let i in category_type) {
      const current = category_type[i];
      const { name } = current;
      if (category[name] == true) result.push(name);
    }
    return result;
  };

  const checkGametypeForCache = ({
    order_id,
    number,
    boxbet,
    bigAmt,
    smallAmt,
    category,
    draw_date,
  }) => {
    if (bigAmt > 0)
      addNewOrderCache({
        order_id,
        number,
        boxbet,
        gametype: "Big",
        draw_date,
        amount: bigAmt,
        category,
      });

    if (smallAmt > 0)
      addNewOrderCache({
        order_id,
        number,
        boxbet,
        gametype: "Small",
        draw_date,
        amount: smallAmt,
        category,
      });
  };

  const cachingOrder = (target, item) => {
    const currentNum = number[target];
    const f_number = Number(currentNum.join(""));
    const f_big = Number(big[target]); // Format Big string -> Number
    const f_small = Number(small[target]); // Format Small string -> Number
    let f_boxbet = null;
    CheckAmountError(f_number, f_big, f_small);
    if (f_number === 0) return;
    if (boxbet[target]) {
      const listofPermutation = getUniquePermutation(currentNum).filter(
        (num) => !soldOut.includes(num)
      );
      
      f_boxbet = listofPermutation.length;
    }
    checkGametypeForCache({
      ...item /* Now filled only order, draw_date, and category */,
      number: f_number,
      boxbet: f_boxbet,
      bigAmt: f_big,
      smallAmt: f_small,
    });
  };
  const checkGametype = (
    orders = [] /* Array temp */,
    bigAmt,
    smallAmt,
    item = {}
  ) => {
    const Big = "Big";
    const Small = "Small";
    let obj = (gtype, amt) => ({ ...item, gametype: gtype, amount: amt });
    if (bigAmt > 0) orders.push(obj(Big, bigAmt));
    if (smallAmt > 0) orders.push(obj(Small, smallAmt));
  };
  const checkBoxbet = async (orders, target, item = {}) => {
    const currentNum = number[target];
    const f_number = Number(currentNum.join(""));
    const f_big = Number(big[target]); // Format Big string -> Number
    const f_small = Number(small[target]); // Format Small string -> Number
    CheckAmountError(f_number, f_big, f_small);
    if (!boxbet[target]) {
      // First Constraint: if it is not boxbet
      checkGametype(orders, f_big, f_small, { ...item, number: f_number });
    } else {
      const listofPermutation = getUniquePermutation(currentNum).filter(
        (num) => !soldOut.includes(num)
      );
      for (let i in listofPermutation) {
        const new_num = listofPermutation[i];
        checkGametype(orders, f_big, f_small, { ...item, number: new_num });
      }
    }
  };
  const handleSubmit = async () => {
    try {
      let orders = [];
      // Determine selected category
      const selectedCategories = defineCategory(category);

      // Restrict, must have at least one number to submit
      const init_seq = sequence[0];
      const init_num = Number(number[init_seq].join(""));
      // Check if there is missing required item? if true, return error
      CheckError(selectedCategories, init_num, phoneNum);

      const order_id = generateUUID();
      /*  #A Iterate through all categories */
      for (let i in selectedCategories) {
        const selectedCategory = selectedCategories[i];

        /* #B Iterate through all sequences */
        for (let i in sequence) {
          const current = sequence[i];
          checkBoxbet(orders, current, {
            category: selectedCategory,
            order_id,
            agent_id: agentId,
            draw_date,
          });
        }
      } // End of for loops

      // Cache
      for (let i in sequence) {
        const current = sequence[i];
        cachingOrder(current, {
          order_id,
          draw_date,
          category: selectedCategories,
        });
      }
      /* --- submit user ticket number */
      const { error } = await supabase.from("order_tickets").insert(orders);
      /* --- submit user credentials e.g Phone Number */
      const customerOrder = await supabase.from("customer_order").insert({
        phone_number: phoneNum,
        order_id,
        agent_id: agentId,
        draw_date,
      });

      /* Provide feedback if the ticket succesfully updated to supabase */
      if (!error || !customerOrder.error) {
        updateUserInfo({
          order_id,
          draw_date,
          phoneNum,
          purchaseAt: `${new Date().toLocaleString("en-GB", {
            timeZone: "UTC",
          })}`,
        }); // cache userinfo

        toast({
          variant: "successful",
          title: "Successfully purchase ticket",
          description: `You have successfully purchase a ticket ${order_id}`,
        });
        reset();

        await BufferExecution({
          duration: 5, // 5 secs
          caller: () => router.push("/order/receipt"),
        });
      } else throw new Error("Unable to buy Ticket");
    } catch (error) {
      reset();
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    }
  };
  return <SubmitButton onClick={handleSubmit} />;
}
