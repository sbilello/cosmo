import { docsBaseURL } from "@/lib/constatnts";
import { cn } from "@/lib/utils";
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { getFederatedGraphs } from "@wundergraph/cosmo-connect/dist/platform/v1/platform-PlatformService_connectquery";
import { ReactNode, useState } from "react";
import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { UserMenu, UserMenuMobile } from "../user-menu";
import { LayoutProps } from "./layout";

export type NavLink = {
  title: string;
  href: string;
  matchExact?: boolean;
  icon: ReactNode;
  separator?: boolean;
};

const isActive = (path: string, currentPath: string, exact = true) => {
  return path === "/" || exact ? path === currentPath : currentPath.match(path);
};

const isExternalUrl = (link: string): boolean => !link?.startsWith("/");

interface SideNavLayoutProps extends LayoutProps {
  links?: NavLink[];
}

const MobileNav = () => {
  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto border-t bg-popover shadow-md animate-in slide-in-from-bottom-64 lg:hidden"
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md p-4 text-popover-foreground">
        <nav className="grid grid-flow-row auto-rows-max items-center justify-center text-center text-sm">
          <Link
            href={docsBaseURL}
            className="flex items-center text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            Documentation
          </Link>
        </nav>
        <UserMenuMobile />
        <div className="mx-auto">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

const Graphs = () => {
  const { data } = useQuery(getFederatedGraphs.useQuery());

  const router = useRouter();
  const slug = router.query.slug as string;
  const organizationSlug = router.query.organizationSlug as string;
  if (router.pathname.split("/")[2] !== "graph") return null;

  return (
    <Select
      value={slug}
      onValueChange={(gID) => router.push(`/${organizationSlug}/graph/${gID}`)}
    >
      <SelectTrigger value={slug} className="w-[200px] lg:w-full">
        <SelectValue aria-label={slug}>{slug}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {data?.graphs?.map(({ name }) => {
          return (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export const Nav = ({ children, links }: SideNavLayoutProps) => {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="flex min-h-screen flex-1 flex-col lg:grid lg:grid-cols-[auto_1fr] lg:divide-x">
      <aside className="sticky top-[0] z-40 flex min-w-[248px] flex-col bg-background pt-4 lg:h-screen lg:px-6 lg:pb-4">
        <div className="flex flex-col gap-y-4 px-4 lg:gap-y-8 lg:px-0">
          <div className="flex items-center justify-between gap-x-4">
            <div className="flex w-full items-center gap-x-4 gap-y-8 lg:flex-col lg:items-start">
              <Link href="/" className="flex items-center space-x-2">
                <Logo />
                <span className="hidden text-lg font-bold sm:inline-block">
                  Studio
                </span>
              </Link>
              <Graphs />
            </div>
            <button
              className="flex items-center space-x-2 lg:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <Cross2Icon className="h-5 w-5" />
              ) : (
                <HamburgerMenuIcon className="h-5 w-5" />
              )}
            </button>
            {showMobileMenu && <MobileNav />}
          </div>
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none lg:grid lg:items-start">
            {links?.map((item, index) => {
              const isCurrent = isActive(
                item.href,
                router.asPath.split("?")[0],
                item.matchExact
              );

              return (
                <div key={index}>
                  {item.href && (
                    <Link key={index} href={item.href}>
                      <span
                        className={cn(
                          "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          isCurrent ? "bg-accent" : "transparent"
                        )}
                      >
                        {item.icon}
                        <span className="whitespace-nowrap">{item.title}</span>
                      </span>
                    </Link>
                  )}
                  {item.separator && (
                    <Separator
                      orientation="horizontal"
                      className="my-3 hidden lg:block"
                    />
                  )}
                </div>
              );
            })}
          </nav>
        </div>
        <Separator
          orientation="horizontal"
          className="mt-4 lg:mb-4 lg:mt-auto"
        />
        <div className="hidden items-center justify-between lg:flex">
          <Link
            href={docsBaseURL}
            className="flex items-center text-lg font-medium text-foreground/80 transition-colors hover:text-foreground sm:text-sm"
            target="_blank"
            rel="noreferrer"
          >
            Documentation
          </Link>
          <ThemeToggle />
          <UserMenu />
        </div>
      </aside>
      <main className="flex-1 pt-4 lg:pt-0">{children}</main>
    </div>
  );
};