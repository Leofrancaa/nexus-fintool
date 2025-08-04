"use client";

import { useState } from "react";
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
  TargetIcon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Despesas", href: "/despesas", icon: TrendingDown },
  { name: "Receitas", href: "/receitas", icon: TrendingUp },
  { name: "Cartões", href: "/cartoes", icon: CreditCard },
  { name: "Categorias", href: "/categorias", icon: FolderKanban },
  { name: "Limites", href: "/limites", icon: Target },
  { name: "Investimentos", href: "/investimentos", icon: Banknote },
  { name: "Planos", href: "/planos", icon: TargetIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const toggleMobile = () => setIsMobileOpen((prev) => !prev);

  return (
    <>
      {/* Topo Mobile com logo + menu (aparece só quando fechado) */}
      {!isMobileOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-full bg-[#0a0a0a] flex items-center justify-between px-8 py-3 z-40 shadow-md">
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
            className="p-2 text-white bg-gray-800 rounded-md"
          >
            <Menu />
          </button>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside
        className={clsx(
          "hidden lg:flex h-screen bg-[#0a0a0a] text-white border-r border-white/5 transition-all duration-300",
          {
            "w-[15%]": isOpen,
            "w-[4%]": !isOpen,
          }
        )}
      >
        <div className="flex flex-col w-full">
          {/* Logo + botão retrátil */}
          <div className="flex items-center justify-between px-4 pt-6">
            {isOpen ? (
              <div className="w-[80px] transition-all">
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
              <div className="w-4" /> // espaço reservado para manter alinhamento
            )}

            {/* Botão de retração (desktop) */}
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 lg:flex hidden cursor-pointer"
            >
              {isOpen ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="border-t border-white/10 mx-4 my-4" />

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
                      "hover:bg-gradient-to-r hover:from-[#2256FF] hover:via-[#00D4AA] hover:to-[#00D4D4] hover:text-black":
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
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {isMobileOpen && (
        <div className="fixed top-0 left-0 z-40 h-full w-[240px] bg-[#232222] text-white shadow-lg transition-transform duration-300 lg:hidden">
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMobile}
              className="text-white hover:text-gray-300"
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

          <div className="border-t border-white/10 mx-4 my-4" />

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
                      "hover:bg-gradient-to-r hover:from-[#2256FF] hover:via-[#00D4AA] hover:to-[#00D4D4] hover:text-black":
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
