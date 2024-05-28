import SubAccountsDataTable from "./accounts-table";
import { columns } from "./accounts-table/columns";
import { createClient } from "@/supabase/client";
import { SubAccountsColumnType } from "@/lib/types";

type Props = {
  user_id: string;
  subAccounts: SubAccountsColumnType[];
};

export default async function SubAccountsPage({ user_id, subAccounts }: Props) {
  const fetchCredentials = async (user_id: string) => {
    try {
      const supabase = createClient();
      const { error, data } = await supabase
        .from("users")
        .select("role, tier")
        .eq("id", user_id)
        .single();

      if (error) throw new Error("Something wrong when fetching credentials");
      return data;
    } catch (error) {
      return null;
    }
  };

  const response = await fetchCredentials(user_id);
  if(!response) return;
  const {role, tier} = response;
  return (
    <div>
      <SubAccountsDataTable
        columns={columns}
        data={subAccounts}
        user_id={user_id}
        role={role!}
        tier={tier}
      />
    </div>
  );
}
