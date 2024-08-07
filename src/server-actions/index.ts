"use server";
import type {
  CreateSubAccountSchemaType,
  ManageSubAccountSchemaType,
  UserAuthSchemaType,
} from "@/lib/types";
import path from "@/lib/path";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { endOfMonth, formatDate, startOfMonth } from "@/lib/utils";
import { createSupabaseAdmin } from "@/supabase/client";
import { revalidatePath } from "next/cache";

export async function currentAgent() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(path.login);
  return user;
}

export async function currentUserRoleTier(user_id: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("users")
      .select("role, tier, commission(*)")
      .eq("id", user_id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function RetrieveAgentCredentials(user_id: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("users")
    .select("*, commission(*), credits(*)")
    .eq("id", user_id)
    .single();

  if (!data) redirect(path.login);
  return data;
}
export async function LoginAction(values: UserAuthSchemaType) {
  const supabase = createClient();
  const username = await supabase
    .from("users")
    .select("email")
    .eq("username", values.agent_id)
    .single();

  if (username.error)
    return redirect(`${path.login}?message=Cannot authenticate agent id`);

  const { error } = await supabase.auth.signInWithPassword({
    email: username.data.email!,
    password: values.password,
  });
  if (error) {
    return redirect(`${path.login}?message=Could not authenticate user`);
  }
  return redirect(path.dashboard);
}

export async function LogoutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect(path.login);
}

/** Create new subaccount **/
export async function CreateSubAccountAction(
  values: CreateSubAccountSchemaType
) {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await (
      await supabase
    ).auth.admin.createUser({
      email: values.email,
      password: values.password,
      email_confirm: true,
      user_metadata: {
        username: values.username,
        email: values.email,
        role: values.role,
        parent: values.parent,
        tier: `${Number(values.tier) + 1}`,
      },
    });
    if (error) throw new Error();
    if (data) await UpsertUserCommission(data.user.id, values.percent);
    return true;
  } catch (err) {
    console.log(err);
  }
}

export async function UpsertUserCommission(user_id: string, percent: number) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("commission")
      .upsert({ id: user_id, percent })
      .select();
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function CreateNewTicketOrder(values: NewTicketNumbers[]) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("ticket_numbers")
      .insert(values as TicketNumbers[])
      .select("id");
    if (error) throw new Error();

    return data;
  } catch (err) {
    console.log(err);
  }
}

/* Create new customer order */
export async function CreateNewCustomerOrder(
  values: Partial<CustomerOrders>[]
) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("customer_orders")
      .insert(values as CustomerOrders[]);
    if (error) throw new Error("Unable to create new customer order");
  } catch (err) {
    console.log(err);
  }
}

/* --- Read Commission percent (root)(!Im: HQ Specified) ---- */
export async function RetrieveRootCommission() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("root_commission")
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.log(error);
  }
}

/** (Read) Retrieve all sales made by Agent  */
export async function RetrieveAllSales() {
  try {
    const currDate = new Date();
    const supabase = createClient();
    const { error, data } = await supabase
      .from("customer_orders")
      .select("*, ticket_numbers(*)")
      .gte("created_at", formatDate(startOfMonth(currDate)))
      .lte("created_at", formatDate(endOfMonth(currDate)));
    if (error) throw new Error();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* --- Read Target Sales for selected certain range draw_date --- */
//prettier-ignore
export async function RetrieveSalesOnRange(value: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("customer_orders")
      .select(`*, ticket_numbers!inner(*)`)
      .filter("ticket_numbers.draw_date", "in", value);

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}

/* (Read) Retrieve all SubAccount of Agent */
export const RetrieveAllSubAccounts = async (user_id: string) => {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("users")
      // .select("id, username, email, role, tier")
      .select("*, commission(*)")
      .eq("refer_to", user_id);
    if (error) throw new Error("Something wrong when fetching all subaccounts");
    return data;
  } catch (error) {
    return [];
  }
};

/* --- Retrieve Winning Orders ---*/
export async function RetrieveWinningOrders(
  user_id: string,
  draw_date: string
) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("winning_orders")
      .select(
        
        "*, customer_orders!inner(id, phone_number, users(id, username, email)), prizes(prize_type, prize_value) "
      )
      .eq("draw_date", draw_date)
      .eq("customer_orders.user_id", user_id);
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function UpdateSubAccountAction(
  values: ManageSubAccountSchemaType,
  user_id: string
) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update({ tier: values.tier })
      .eq("id", user_id);
    if (error) throw new Error("Unable to update subaccount credentials");
    await UpsertUserCommission(user_id, values.percent);
  } catch (err) {
    console.log(err);
  }
}

export async function UpsertCustomerOrder(values: CustomerOrders[]) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("customer_orders")
      .upsert(values)
      .select("*, ticket_numbers(*)");
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function UpsertUserCredits(user_id: string, credit_value: number) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("credits")
      .upsert({ id: user_id, credit_value })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function UpsertWinningPayout(values: WinningOrdersWCredentials) {
  let temp: WinningOrders = {
    customer_id: values.customer_id,
    prize_id: values.prize_id,
    number: values.number,
    draw_date: values.draw_date,
    gametype: values.gametype,
    category: values.category,
    claimed: values.claimed,
    deposited: values.deposited,
  };
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("winning_orders")
      .upsert(temp)
      .select(
        "*, customer_orders(id, phone_number, users(id, username, email)), prizes(prize_type, prize_value) "
      )
      .single();
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function DeleteSubAccountAction(user_id: string) {
  try {
    const supabase = createSupabaseAdmin();

    const { error } = await (await supabase).auth.admin.deleteUser(user_id);
    if (error) throw new Error();

    return revalidatePath("/dashboard");
  } catch (err) {
    console.log(err);
  }
}
