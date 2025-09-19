"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  CreditCard,
  FolderKanban,
  Target,
  Gauge,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen, // ⬅️ IMPORT novo
} from "lucide-react";
import clsx from "clsx";
import { ThemeToggle } from "@/components/toggles/themeToggle";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Despesas", href: "/despesas", icon: TrendingDown },
  { name: "Receitas", href: "/receitas", icon: TrendingUp },
  { name: "Cartões", href: "/cartoes", icon: CreditCard },
  { name: "Categorias", href: "/categorias", icon: FolderKanban },
  { name: "Limites", href: "/limites", icon: Gauge },
  { name: "Planos", href: "/planos", icon: Target },
  { name: "Manual", href: "/manual", icon: BookOpen }, // ⬅️ NOVO ITEM
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const toggleMobile = () => setIsMobileOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
  }, [isMobileOpen]);

  return (
    <>
      {!isMobileOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-full flex items-center justify-between px-8 py-3 z-40 shadow-md bg-[var(--background)] text-[var(--foreground)]">
          <div className="w-[80px]">
            <Image
              src="/logo-nexus.png"
              alt="Logo Nexus"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </div>
          <button
            onClick={toggleMobile}
            aria-label="Abrir menu"
            aria-expanded={isMobileOpen}
            className="
    p-2.5 rounded-xl
    border border-[color:var(--card-border)]
    bg-[var(--card-icon-bg-neutral)]
    text-[var(--card-icon)]
    shadow-sm transition-colors
    hover:bg-[var(--hover-bg)]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--foreground)]
  "
          >
            <Menu className="w-6 h-6" strokeWidth={2.25} />
          </button>
        </div>
      )}

      {/* Desktop */}
      <aside
        className={clsx(
          "hidden md:flex sticky top-0 self-start h-screen transition-all duration-300",
          "bg-[var(--background)] text-[var(--foreground)] border-r border-[color:var(--sidebar-border)]",
          isOpen
            ? "md:w-[22%] lg:w-[18%] xl:w-[15%] 2xl:w-[16%]"
            : "md:w-[8%] lg:w-[6%] xl:w-[5%] 2xl:w-[3%]"
        )}
      >
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center justify-between px-4 pt-6">
            {isOpen ? (
              <div className="w-[110px] transition-all">
                <Image
                  src="/logo-nexus.png"
                  alt="Logo Nexus"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                  priority
                />
              </div>
            ) : (
              <div className="w-4" />
            )}
            <button
              onClick={toggleSidebar}
              className="text-[var(--foreground)] hover:opacity-70 cursor-pointer"
            >
              {isOpen ? (
                <ChevronLeft className="w-7 h-7" />
              ) : (
                <ChevronRight className="w-7 h-7" />
              )}
            </button>
          </div>

          <div className="border-t border-[color:var(--sidebar-border)] mx-4 my-4" />

          <nav className="flex flex-col gap-2 px-2">
            {navItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-3 transition-colors duration-200 font-medium",
                    {
                      "bg-gradient-to-r from-[#2256FF] via-[#00D4AA] to-[#00D4D4] text-white":
                        isActive,
                      "bg-transparent text-[var(--foreground)] hover:bg-[var(--hover-bg)]":
                        !isActive,
                    }
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {isOpen && <span>{name}</span>}
                </Link>
              );
            })}
          </nav>

          {isOpen && (
            <div className="mt-auto px-4 pb-24">
              <ThemeToggle />
            </div>
          )}
        </div>
      </aside>

      {/* Mobile */}
      {isMobileOpen && (
        <div className="fixed top-0 left-0 z-40 h-full w-full shadow-lg transition-transform duration-300 lg:hidden bg-[var(--background)] text-[var(--foreground)]">
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMobile}
              className="hover:opacity-70 text-[var(--foreground)]"
            >
              <X />
            </button>
          </div>

          <div className="flex justify-center py-4">
            <div className="w-[100px]">
              <Image
                src="/logo-nexus.png"
                alt="Logo Nexus"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                priority
              />
            </div>
          </div>

          <div className="border-t border-[color:var(--sidebar-border)] mx-4 my-4" />

          <nav className="flex flex-col gap-2 px-4">
            {navItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={toggleMobile}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-4 py-3 transition-all font-medium",
                    {
                      "bg-gradient-to-r from-[#2256FF] via-[#00D4AA] to-[#00D4D4] text-white":
                        isActive,
                      "hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white":
                        !isActive,
                    }
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex justify-center mt-6">
            <ThemeToggle />
          </div>
        </div>
      )}

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={toggleMobile}
        />
      )}
    </>
  );
}
