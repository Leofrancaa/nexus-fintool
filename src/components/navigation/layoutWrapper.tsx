"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Toaster } from "react-hot-toast";

const publicRoutes = ["/login", "/register", "/"];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublic = publicRoutes.includes(pathname);

  return (
    <>
      {!isPublic ? (
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 bg-gray-50">{children}</main>
        </div>
      ) : (
        <>{children}</>
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#111827",
            color: "#F3F4F6",
            border: "1px solid #3B82F6",
            borderRadius: "12px",
            padding: "12px 16px",
            fontFamily: "var(--font-manrope), sans-serif",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}
