"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface NavigationItem {
  title: string;
  href?: string;
  description?: string;
  items?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "About",
    items: [
      {
        title: "Overview",
        href: "/about",
        description: "Learn about our mission and vision",
      },
      {
        title: "Leadership",
        href: "/about/leadership",
        description: "Meet our leadership team",
      },
      {
        title: "History",
        href: "/about/history",
        description: "Our journey and milestones",
      },
    ],
  },
  {
    title: "Faculty",
    items: [
      {
        title: "All Faculty",
        href: "/faculty",
        description: "Browse our faculty directory",
      },
      {
        title: "Research Areas",
        href: "/faculty/research-areas",
        description: "Explore research specializations",
      },
      {
        title: "Join Our Team",
        href: "/faculty/careers",
        description: "Faculty positions and opportunities",
      },
    ],
  },
  {
    title: "Research",
    items: [
      {
        title: "Projects",
        href: "/research/projects",
        description: "Current and completed research projects",
      },
      {
        title: "Publications",
        href: "/research/publications",
        description: "Academic papers and publications",
      },
      {
        title: "Collaborations",
        href: "/research/collaborations",
        description: "Partnership opportunities",
      },
    ],
  },
  {
    title: "Programs",
    items: [
      {
        title: "All Programs",
        href: "/programs",
        description: "Browse all degree programs and certificates",
      },
      {
        title: "Degree Programs",
        href: "/programs?type=degree",
        description: "PhD and Master's degree programs",
      },
      {
        title: "Certificates",
        href: "/programs?type=certificate",
        description: "Professional certificate programs",
      },
      {
        title: "Continuing Education",
        href: "/programs?type=continuing-education",
        description: "Lifelong learning opportunities",
      },
      {
        title: "Educational Resources",
        href: "/programs/resources",
        description: "Learning materials and tools",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        title: "Datasets",
        href: "/resources/datasets",
        description: "Research datasets and repositories",
      },
      {
        title: "Software Tools",
        href: "/resources/tools",
        description: "Open source tools and libraries",
      },
      {
        title: "Documentation",
        href: "/resources/docs",
        description: "Technical documentation and guides",
      },
    ],
  },
  {
    title: "News & Events",
    href: "/news",
  },
  {
    title: "Contact",
    items: [
      {
        title: "Contact Us",
        href: "/contact",
        description: "Get in touch with our team",
      },
      {
        title: "Collaboration",
        href: "/collaboration",
        description: "Partnership and collaboration opportunities",
      },
    ],
  },
];

interface NavigationProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export function Navigation({ isMobile = false, onItemClick }: NavigationProps) {
  const pathname = usePathname();

  if (isMobile) {
    return <MobileNavigation items={navigationItems} onItemClick={onItemClick} />;
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigationItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.items ? (
              <>
                <NavigationMenuTrigger
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-tulane-green focus:text-tulane-green",
                    pathname.startsWith(item.items[0]?.href?.split("/")[1] || "") &&
                      "text-tulane-green"
                  )}
                >
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {item.items.map((subItem) => (
                      <NavigationMenuLink key={subItem.title} asChild>
                        <Link
                          href={subItem.href || "#"}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-enhanced",
                            pathname === subItem.href && "bg-accent"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">
                            {subItem.title}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {subItem.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link
                  href={item.href || "#"}
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none focus-visible:ring-enhanced disabled:pointer-events-none disabled:opacity-50",
                    pathname === item.href && "bg-accent text-accent-foreground"
                  )}
                >
                  {item.title}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface MobileNavigationProps {
  items: NavigationItem[];
  onItemClick?: () => void;
}

function MobileNavigation({ items, onItemClick }: MobileNavigationProps) {
  const [openItems, setOpenItems] = React.useState<string[]>([]);
  const pathname = usePathname();

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
      {items.map((item) => (
        <div key={item.title}>
          {item.items ? (
            <div>
              <button
                onClick={() => toggleItem(item.title)}
                className="flex w-full items-center justify-between rounded-md px-4 py-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none focus-visible:ring-enhanced min-h-[44px] touch-manipulation"
                aria-expanded={openItems.includes(item.title)}
                aria-controls={`mobile-submenu-${item.title}`}
              >
                {item.title}
                <motion.div
                  animate={{ rotate: openItems.includes(item.title) ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openItems.includes(item.title) && (
                  <motion.div
                    id={`mobile-submenu-${item.title}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="ml-4 mt-2 space-y-1 border-l border-border pl-4">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href || "#"}
                          onClick={onItemClick}
                          className={cn(
                            "block rounded-md px-4 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none focus-visible:ring-enhanced min-h-[44px] touch-manipulation",
                            pathname === subItem.href &&
                              "bg-accent text-accent-foreground"
                          )}
                        >
                          <div className="font-medium">{subItem.title}</div>
                          {subItem.description && (
                            <div className="text-xs text-muted-foreground">
                              {subItem.description}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href={item.href || "#"}
              onClick={onItemClick}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none focus-visible:ring-enhanced",
                pathname === item.href && "bg-accent text-accent-foreground"
              )}
            >
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}