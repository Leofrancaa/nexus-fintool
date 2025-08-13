"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

function isStandalonePWA(): boolean {
  if (typeof window === "undefined") return false;

  // Padrão (Chrome/Android, Desktop)
  const mq = window.matchMedia?.("(display-mode: standalone)");
  if (mq?.matches) return true;

  // iOS Safari (usa navigator.standalone)
  const nav = window.navigator as NavigatorWithStandalone;
  return !!nav.standalone;
}

export default function PwaLoginRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const enforceLogin = () => {
      if (isStandalonePWA() && pathname !== "/login") {
        router.replace("/login");
      }
    };

    enforceLogin();

    // Quando o app volta do background, garante que permaneça no /login
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") enforceLogin();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [pathname, router]);

  return null;
}
