"use client";
import { useEffect, useState } from "react";
import { IconChevronsLeft, IconMenu2, IconX } from "@tabler/icons-react";
import { Layout, LayoutHeader } from "../custom/layout";
import { Button, buttonVariants } from "../custom/button";
import { cn } from "@/lib/utils";
import { SideLinks, SideLinksList } from "./sidelinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Triangle } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  // isCollapsed: boolean
  // setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}
function Logo() {
  return (
    <div className="font-medium">
      <Button variant={"ghost"} size={"icon"} aria-label="Home">
        <Triangle className="fill-foreground" />
      </Button>
    </div>
  );
}
function NavLinks({ isCollapsed }: { isCollapsed?: boolean }) {
  const currentPath = usePathname();
  return (
    <nav className="flex flex-col gap-2 px-1 ">
      {SideLinksList.map((navlink) => {
        const link = SideLinks[navlink];
        return (
          <Link
            key={link.id}
            href={link.href}
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              }),
              "h-10 w-full justify-start  gap-2 whitespace-wrap ",
              currentPath === link.href && "bg-primary text-background"
            )}
          >
            <link.icon size={18} />
            {!isCollapsed && link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav() {
  const [navOpened, setNavOpened] = useState(false);
  return (
    <div className="fixed z-[100] flex flex-col md:hidden w-full h-[var(--header-height)]  ">
      {/* ---- Background Overlay --- */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${
          navOpened ? "h-svh opacity-50" : "h-0 opacity-0"
        } w-full bg-black md:hidden`}
      />
      <div className="relative flex flex-col flex-grow flex-1">
        <div className="flex items-center justify-between p-4 bg-background">
          {/* ---- Logo ---- */}
          <Logo />
          {/* ---- Action Button ---- */}
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle Navigation"
              aria-controls="sidebar-menu"
              aria-expanded={navOpened}
              onClick={() => setNavOpened((prev) => !prev)}
            >
              {navOpened ? <IconX /> : <IconMenu2 />}
            </Button>
          </div>
        </div>
        <div
          className={cn(
            "bg-background py-2 px-2 transition-[max-height,padding] duration-500 group border-t ",
            navOpened
              ? "bg-background max-h-screen"
              : "overflow-hidden max-h-0 py-0"
          )}
        >
          <NavLinks />
        </div>
      </div>
    </div>
  );
}

function SidebarNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsMouseEnter(!isMouseEnter)}
      onMouseLeave={() => setIsMouseEnter(!isMouseEnter)}
      className={cn(
        "hidden relative md:flex flex-col border-r transition-[width]",
        isCollapsed ? "md:w-14" : "md:w-64"
      )}
    >
      <div className="h-[var(--header-height)] border-b p-2 flex items-center gap-2">
        <Logo />
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-medium text-sm">Agent</span>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        )}
      </div>
      <div className="py-2">
        <NavLinks isCollapsed={isCollapsed} />
      </div>
      {isMouseEnter ? (
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          variant={"outline"}
          size="icon"
          className="absolute right-0 h-7 w-7 m-2 hidden md:flex"
        >
          <IconChevronsLeft
            stroke={1.5}
            className={`h-5 w-5 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </Button>
      ) : null}
    </div>
  );
}

export default function Sidebar() {
  return (
    <>
      <MobileNav />
      <SidebarNav />
    </>
  );
}