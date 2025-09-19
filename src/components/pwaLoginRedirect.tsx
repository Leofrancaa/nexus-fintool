"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

function isStandalonePWA(): boolean {
  if (typeof window === "undefined") return false;
  // Chrome/Android/Desktop
  if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
  // iOS Safari legado
  return Boolean((window.navigator as NavigatorWithStandalone).standalone);
}

function getSession(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export default function PwaLoginRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isStandalonePWA()) return;

    const ss = getSession();
    const alreadyHandled = ss?.getItem("pwa:launchHandled") === "1";

    // Só força /login na PRIMEIRA abertura da sessão do app
    if (!alreadyHandled) {
      if (pathname !== "/login") {
        router.replace("/login");
      }
      ss?.setItem("pwa:launchHandled", "1");
    }
  }, [pathname, router]);

  return null;
}
