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
  Banknote,
  Gauge,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
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
  { name: "Investimentos", href: "/investimentos", icon: Banknote },
  { name: "Planos", href: "/planos", icon: Target },
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
      {/* Topo Mobile com logo + menu */}
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
            className="p-2 bg-gray-200 dark:bg-gray-800 rounded-md text-[var(--foreground)]"
          >
            <Menu />
          </button>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside
        className={clsx(
          "hidden lg:flex sticky top-0 self-start h-screen transition-all duration-300",
          "bg-[var(--background)] text-[var(--foreground)] border-r border-[color:var(--sidebar-border)]",
          {
            "w-[15%]": isOpen,
            "w-[4%]": !isOpen,
          }
        )}
      >
        <div className="flex flex-col w-full h-full">
          {/* Logo + botão retrátil */}
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

          {/* Navegação */}
          <nav className="flex flex-col gap-2 px-2">
            {navItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-3 transition-all font-medium",
                    {
                      "bg-gradient-to-r from-[#2256FF] via-[#00D4AA] to-[#00D4D4] text-white":
                        isActive,
                      "hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white":
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

          {/* Theme Toggle Desktop */}
          {isOpen && (
            <div className="mt-auto px-4 pb-24">
              <ThemeToggle />
            </div>
          )}
        </div>
      </aside>

      {/* Sidebar Mobile */}
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

          {/* Logo */}
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

          {/* Theme Toggle Mobile */}
          <div className="flex justify-center mt-6">
            <ThemeToggle />
          </div>
        </div>
      )}

      {/* Overlay com blur no mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={toggleMobile}
        />
      )}
    </>
  );
}
