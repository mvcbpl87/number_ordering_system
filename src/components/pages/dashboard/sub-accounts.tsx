import SubAccountsDataTable from "./accounts-table";
import { columns } from "./accounts-table/columns";
import { currentUserRoleTier } from "@/server-actions";

type Props = {
  user_id: string;
  subAccounts: UsersWCommission[];
  commission_value: RootCommission | undefined;
};

export default async function SubAccountsPage({
  user_id,
  subAccounts,
  commission_value,
}: Props) {
  const credentials = await currentUserRoleTier(user_id);

  return (
    <div>
      <SubAccountsDataTable
        commission_value={credentials?.role === 
          '1' ? commission_value : credentials?.commission!}
        columns={columns}
        data={subAccounts.filter( account => account.refer_to === user_id)}
        user_id={user_id}
        role={credentials?.role!}
        tier={credentials?.tier!}
      />
    </div>
  );
}
