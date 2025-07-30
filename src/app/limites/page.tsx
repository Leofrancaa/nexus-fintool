import PageTitle from "@/components/pageTitle";
import AddButton from "../../components/ui/addButton";

export default function Limits() {
  return (
    <main className="flex flex-col min-h-screen bg-black px-8 py-4">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mt-12 lg:mt-0">
        <div>
          <PageTitle
            title="Limites"
            subTitle="Gerencie e acompanhe seus limites"
          />
        </div>
        <div>
          <AddButton variant="primary" className="h-10">
            Novo Limite
          </AddButton>
        </div>
      </div>
    </main>
  );
}
