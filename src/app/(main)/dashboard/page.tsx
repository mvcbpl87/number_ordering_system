import CardSales from "@/components/pages/dashboard/card-sales";
import { RecentSales } from "@/components/pages/dashboard/recent-sales";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconCurrencyDollar } from "@tabler/icons-react";
import SubAccountsPage from "@/components/pages/dashboard/sub-accounts";
import {
  RetrieveAllSales,
  RetrieveAllSubAccounts,
  RetrieveRootCommission,
  currentAgent,
} from "@/server-actions";
import { createClient } from "@/supabase/server";
import {
  DailyTimeFrame,
  ISOTimeFormater,
  WeekTimeFrame,
  endOfMonth,
  startOfMonth,
} from "@/lib/utils";

const SalesContent = [
  {
    title: "Monthly Sales",
    icon: IconCurrencyDollar,
    type: "currency",
    value: 100,
    description: "",
  },
  {
    title: " Weekly Sales",
    icon: IconCurrencyDollar,
    type: "currency",
    value: 50,
    description: "",
  },
  {
    title: "Daily Sales",
    icon: IconCurrencyDollar,
    type: "currency",
    value: 0,
    description: "",
  },
  {
    title: "Active Now",
    icon: IconCurrencyDollar,
    type: "user",
    value: 5,
    description: "",
  },
];

export const revalidate = 20;
export default async function MainPage() {
  let monthlySales = 0;
  let weeklySales = 0;
  let dailySales = 0;
  let initial = 0;
  // await new Promise(resolve => setTimeout(resolve, 3000))
  const user = await currentAgent();
  const allSales = await RetrieveAllSales();
  const allSubAccounts = await RetrieveAllSubAccounts(user?.id!);
  const root_commission = await RetrieveRootCommission();

  if (allSales) {
    const currentUserSales = allSales?.filter(
      (item) => item.user_id === user.id
    );
    monthlySales = currentUserSales.reduce((accumulator, current) => {
      const { ticket_numbers } = current;
      const { number, category, amount } = ticket_numbers!;
      const pivot = number.length * amount * category.length;
      return (accumulator += pivot);
    }, initial);

    weeklySales = currentUserSales
      ?.filter((sales) =>
        WeekTimeFrame().includes(ISOTimeFormater(sales.created_at))
      )
      .reduce((accumulator, current) => {
        const { ticket_numbers } = current;
        const { number, category, amount } = ticket_numbers!;
        const pivot = number.length * amount * category.length;
        return (accumulator += pivot);
      }, initial);

    dailySales = currentUserSales
      ?.filter(
        (sales) => ISOTimeFormater(sales.created_at) === DailyTimeFrame()
      )
      .reduce((accumulator, current) => {
        const { ticket_numbers } = current;
        const { number, category, amount } = ticket_numbers!;
        const pivot = number.length * amount * category.length;
        return (accumulator += pivot);
      }, initial);
  }

  return (
    <div className="bg-muted/20 flex flex-col flex-grow relative overflow-auto ">
      <div className=" px-4 py-6 md:px-6 absolute inset-0 space-y-[1rem]  ">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard
          </h1>
        </div>
        <Tabs defaultValue="Overview" className="space-y-[1rem]">
          <TabsList>
            <TabsTrigger value="Overview">Overview</TabsTrigger>
            <TabsTrigger value="subaccounts">Sub Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="subaccounts">
            <SubAccountsPage
              user_id={user?.id!}
              subAccounts={allSubAccounts}
              commission_value={root_commission}
            />
          </TabsContent>

          {/* Card Sales */}
          <TabsContent value="Overview" className="space-y-[1rem]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <CardSales
                title={"Monthly Sales"}
                type={"currency"}
                icon={IconCurrencyDollar}
                value={!monthlySales ? 0 : monthlySales}
                descriptions={""}
              />
              <CardSales
                title={"Weekly Sales"}
                type={"currency"}
                icon={IconCurrencyDollar}
                value={!weeklySales ? 0 : weeklySales}
                descriptions={""}
              />
              <CardSales
                title={"Daily Sales"}
                type={"currency"}
                icon={IconCurrencyDollar}
                value={!dailySales ? 0 : dailySales}
                descriptions={""}
              />
              <CardSales
                title={"Active Now"}
                type={"user"}
                icon={IconCurrencyDollar}
                value={!allSubAccounts ? 0 : allSubAccounts.length}
                descriptions={""}
              />
            </div>

            {/* Main Things */}
            <div className="grid grid-1 gap-4 flex-grow ">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales (Downline)</CardTitle>
                  <CardDescription>
                    You made {allSales?.length} sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales SubAccounts={allSubAccounts!} Sales={allSales} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
