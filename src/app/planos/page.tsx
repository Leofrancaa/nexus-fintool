"use client";
import PageTitle from "@/components/pageTitle";
import AddButton from "../../components/ui/addButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Plans() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <main className="flex flex-col min-h-screen bg-black px-8 py-4">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mt-12 lg:mt-0">
        <div>
          <PageTitle
            title="Planos"
            subTitle="Gerencie e acompanhe seus planos"
          />
        </div>
        <div>
          <AddButton variant="primary" className="h-10">
            Novo Plano
          </AddButton>
        </div>
      </div>
    </main>
  );
}
