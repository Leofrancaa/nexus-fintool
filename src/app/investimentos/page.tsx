import PageTitle from "@/components/pageTitle";
import { YearSelect } from "@/components/navigation/yearSelect";
import { MonthSelect } from "@/components/navigation/monthSelect";

export default function Investments() {
  return (
    <main className="flex flex-col min-h-screen bg-black px-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-12 lg:mt-0">
        <PageTitle
          title="Investimentos"
          subTitle="Gerencie e acompanhe seus investimentos"
        />

        <div className="flex justify-center gap-4 w-full md:w-auto">
          <div className="w-full lg:min-w-[200px] lg:max-w-[240px]">
            <YearSelect />
          </div>
          <div className="w-full lg:min-w-[200px] lg:max-w-[240px]">
            <MonthSelect />
          </div>
        </div>
      </div>
    </main>
  );
}
