import { LogoutAction, currentAgent } from "@/server-actions";
import { DatePreset } from "@/lib/game-utils/draw-date-generator";
import { Button, buttonVariants } from "../ui/button";
import {
  IconGoGame,
  IconHome,
  IconListCheck,
  IconTrophy,
} from "@tabler/icons-react";
import Link from "next/link";
import path from "@/lib/path";
import { cn } from "@/lib/utils";

const current = new DatePreset().GET_DRAW_DATE();
const initial_path = `${path.order}/${current[0]}`;
const LinkPath = [
  {
    route: path.dashboard,
    name: "Home",
    icon: IconHome,
  },
  {
    route: `${initial_path}`,
    name: "Game",
    icon: IconGoGame,
  },
  {
    route: `${path.dashboard}/report`,
    name: "Report",
    icon: IconListCheck,
  },
  {
    route: `${path.dashboard}/winning`,
    name: "Winning",
    icon: IconTrophy,
  },
];
export default async function TopNavDashboard() {
  const user = await currentAgent();

  return (
    <div className="h-[42px] p-6 flex items-center justify-end">
      {user ? (
        <div className="flex items-center gap-4 text-sm">
          Hey, {user.email?.split("@agent.auth")[0]}&nbsp;!
          <form action={LogoutAction}>
            <Button size={"sm"}>Logout</Button>
          </form>
        </div>
      ) : (
        <Link
          href="/login"
          className={cn(buttonVariants({size:'sm'}))}
        >
          Login
        </Link>
      )}
    </div>
  );
}
