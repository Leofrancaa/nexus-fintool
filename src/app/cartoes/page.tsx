import PageTitle from "@/components/pageTitle";
import AddButton from "../../components/ui/addButton";

export default function Cards() {
  return (
    <main className="flex flex-col min-h-screen bg-black px-8 py-4">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mt-12 lg:mt-0">
        <div>
          <PageTitle
            title="Cartões"
            subTitle="Gerencie e acompanhe seus cartões"
          />
        </div>
        <div>
          <AddButton variant="primary" className="h-10">
            Novo Cartão
          </AddButton>
        </div>
      </div>
    </main>
  );
}
