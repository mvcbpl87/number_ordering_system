import path from "@/lib/path";
import {
  IconApps,
  IconBarrierBlock,
  IconBoxSeam,
  IconChartHistogram,
  IconChecklist,
  IconComponents,
  IconError404,
  IconExclamationCircle,
  IconHexagonNumber1,
  IconHexagonNumber2,
  IconHexagonNumber3,
  IconHexagonNumber4,
  IconHexagonNumber5,
  IconLayoutDashboard,
  IconMessages,
  IconRouteAltLeft,
  IconServerOff,
  IconSettings,
  IconTruck,
  IconUserShield,
  IconUsers,
  IconTrophy,
  IconGoGame,
} from "@tabler/icons-react";

type SideLinkType = "Game" | "Dashboard" | "Report" | "Winning" | "Settings";

type SideLinkElement = {
  id: string;
  type: string;
  label: string;
  href: string;
  icon: React.ElementType;
};
type SideLinkInstance = SideLinkType;

type SideLinksType = {
  [key in SideLinkType]: SideLinkElement;
};

const Dashboard = {
  id: "side-dashboard",
  type: "Dashboard",
  label: "Dashboard",
  href: path.dashboard,
  icon: IconLayoutDashboard,
};

const Report = {
  id: "side-report",
  type: "Report",
  label: "Report",
  href: path.report,
  icon: IconChecklist,
};

const Winning = {
  id: "side-winning",
  type: "Winning",
  label: "Winning",
  href: path.winning,
  icon: IconTrophy,
};

const Game = {
  id: "side-game",
  type: "Game",
  label: "Go to Lottery game",
  href: path.order,
  icon: IconGoGame,
};
const Settings = {
  id: "side-settings",
  type: "Settings",
  label: "Settings",
  href: path.settings,
  icon: IconSettings,
};

export const SideLinks: SideLinksType = {
  Game,
  Dashboard,
  Report,
  Winning,
  Settings,
};

export const SideLinksList: SideLinkInstance[] = [
  "Game",
  "Dashboard",
  "Report",
  "Winning",
  "Settings",
];
