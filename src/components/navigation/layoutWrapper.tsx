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
        containerStyle={{
          top: 20,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#111827",
            color: "#F3F4F6",
            border: "1px solid #3B82F6",
            borderRadius: "12px",
            padding: "12px 16px",
            fontFamily: "var(--font-manrope), sans-serif",
            fontSize: "14px",
            fontWeight: "500",
            maxWidth: "400px",
            wordBreak: "break-word",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #22c55e",
              background: "#111827",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #ef4444",
              background: "#111827",
            },
          },
          loading: {
            duration: Infinity,
            iconTheme: {
              primary: "#3b82f6",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #3b82f6",
              background: "#111827",
            },
          },
        }}
      />
    </>
  );
}
