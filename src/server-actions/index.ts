"use server";
import type {
  CreateSubAccountSchemaType,
  UserAuthSchemaType,
} from "@/lib/types";
import path from "@/lib/path";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { endOfMonth, startOfMonth } from "@/lib/utils";
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

export async function RetrieveAgentCredentials(user_id: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("users")
    .select("*")
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
    const { error } = await (
      await supabase
    ).auth.admin.createUser({
      email: values.email,
      password: values.password,
      user_metadata: {
        username: values.username,
        email: values.email,
        role: values.role,
        parent: values.parent,
        tier: `${Number(values.tier) + 1}`,
      },
    });
    if (error) throw new Error();

    return true;
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

/** (Read) Retrieve all sales made by Agent  */
export async function RetrieveAllSales(user_id: string) {
  try {
    const currDate = new Date();
    const supabase = createClient();
    const { error, data } = await supabase
      .from("customer_orders")
      .select("*, ticket_numbers(*)")
      .gte("created_at", startOfMonth(currDate))
      .lte("created_at", endOfMonth(currDate))
      .eq("user_id", user_id);

    if (error) throw new Error();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* (Read) Retrieve all SubAccount of Agent */
export const RetrieveAllSubAccounts = async (user_id: string) => {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("users")
      .select("id, username, email, role, tier")
      .eq("refer_to", user_id);
    if (error) throw new Error("Something wrong when fetching all subaccounts");
    return data;
  } catch (error) {
    return [];
  }
};

export async function UpdateSubAccountAction(tier: string, user_id: string) {
  try {
    const supabase = createClient();
    console.log(tier, user_id)
    const { error } = await supabase.from("users").update({ tier }).eq("id", user_id);
    if (error) throw new Error("Unable to update subaccount credentials");
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
